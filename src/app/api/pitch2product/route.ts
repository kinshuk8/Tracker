import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminBucket, getAdminDb } from "@/lib/firebase/admin";
import { defaultValues, FILE_RULES, validateAll, validateFile, validateTotalSize, type FileRef, type FormValues } from "@/lib/pitch2product/schema";
import AdminNotification from "@/emails/pitch2product/AdminNotification";
import ApplicantConfirmation from "@/emails/pitch2product/ApplicantConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const NOTIFY_EMAILS = (process.env.PITCH2PRODUCT_NOTIFY_EMAIL || "ramu@vmkedgemindsolutions.com,md@vmkedgemindsolutions.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const PRIMARY_NOTIFY_EMAIL = NOTIFY_EMAILS[0] || "ramu@vmkedgemindsolutions.com";
// Local part is a deliberate choice, not just a leftover default — swap once the
// vmkedgemindsolutions.com domain is verified in Resend (see the backend plan).
const FROM_ADDRESS = "Pitch2Product <notifications@vmkedgemindsolutions.com>";

function generateReference() {
  const bytes = randomBytes(6);
  return `P2P-${Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("")}`;
}

const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";

/** Emails are stored and compared lowercased so "A@x.com" and "a@x.com" are one person. */
const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Builds the stored filename: personname_submissionid_date_filetype.filetype
 * e.g. RamuSanapala_P2P-GAFYZF_2026-09-29_pptx.pptx
 *
 * The person's name is stripped of separators so the underscore-delimited fields stay
 * unambiguous. `used` de-duplicates within one submission, since two files of the same
 * type would otherwise produce an identical name and the second would overwrite the first.
 */
function buildFileName(fullName: string, reference: string, originalName: string, used: Set<string>) {
  const person = fullName.normalize("NFKD").replace(/[^a-zA-Z0-9]/g, "") || "Applicant";
  const ext = (originalName.split(".").pop() ?? "bin").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  const stem = `${person}_${reference}_${date}_${ext}`;

  let candidate = `${stem}.${ext}`;
  for (let n = 2; used.has(candidate); n++) candidate = `${stem}-${n}.${ext}`;
  used.add(candidate);
  return candidate;
}

/**
 * Deletes uploaded files from Storage when a submission is rejected after upload, so
 * nothing invalid lingers under quota. Best-effort: a delete failure here shouldn't
 * mask the original validation error being returned to the client.
 */
async function cleanupFiles(paths: string[]) {
  if (!paths.length) return;
  const adminBucket = getAdminBucket();
  await Promise.allSettled(paths.map((p) => adminBucket.file(p).delete()));
}

export async function POST(req: Request) {
  let body: { values?: Partial<FormValues>; files?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read your submission. Your answers are still here, so please try again." }, { status: 400 });
  }

  const values: FormValues = { ...defaultValues };
  for (const key of Object.keys(defaultValues) as (keyof FormValues)[]) {
    const raw = body.values?.[key];
    if (raw !== undefined && typeof raw === typeof defaultValues[key]) {
      (values as Record<string, unknown>)[key] = raw;
    }
  }

  const fieldErrors = validateAll(values);
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "Some answers need a change. Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const claimedFiles = Array.isArray(body.files) ? (body.files as Partial<FileRef>[]) : [];
  const paths = claimedFiles.map((f) => f.path).filter((p): p is string => typeof p === "string" && p.startsWith("pitch2product/"));

  // One submission per email address. Checked before any file work so a duplicate is
  // rejected cheaply, and any already-uploaded files are removed rather than left
  // orphaned in Storage.
  const email = normalizeEmail(values.email);
  try {
    const existing = await getAdminDb()
      .collection("pitch2productSubmissions")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existing.empty) {
      await cleanupFiles(paths);
      return NextResponse.json(
        {
          error: `We've already received a submission from ${email}. If you have another idea to submit, please use a different email address, or send us the details at ${PRIMARY_NOTIFY_EMAIL} and we'll take it from there.`,
          fieldErrors: { email: "This email has already been used for a submission." },
        },
        { status: 409 },
      );
    }
  } catch (err) {
    // A failed duplicate check shouldn't silently let a duplicate through, but it also
    // shouldn't lose a genuine submission — surface it as a retryable error.
    console.error("Pitch2Product: duplicate-email check failed:", err);
    await cleanupFiles(paths);
    return NextResponse.json(
      { error: "We couldn't process your submission just now. Your answers are still here, so please try again." },
      { status: 503 },
    );
  }

  // Never trust client-reported size/type for the authoritative check — the client
  // already validated before upload, but a request can be forged. Re-fetch what's
  // actually sitting in Storage and validate against that. Skipped entirely when
  // there are no files, so a Storage/credentials problem never surfaces as a
  // misleading "files" error on a submission that never attached any.
  let files: FileRef[] = [];
  if (paths.length) {
    try {
      const adminBucket = getAdminBucket();
      const metas = await Promise.all(
        paths.map(async (path) => {
          const [meta] = await adminBucket.file(path).getMetadata();
          return { path, meta };
        }),
      );
      // Signing is deliberately deferred: the files get renamed below once the
      // reference number exists, and a URL signed against the old path would 404.
      files = metas.map(({ path, meta }) => {
        const claimed = claimedFiles.find((f) => f.path === path);
        return {
          name: meta.name?.split("/").pop() ?? path,
          url: "",
          path,
          size: Number(meta.size ?? 0),
          type: meta.contentType ?? "",
          description: (claimed?.description ?? "").slice(0, 200),
        };
      });
    } catch {
      return NextResponse.json(
        { error: "We couldn't verify your uploaded files. Please try submitting again." },
        { status: 422 },
      );
    }
  }

  if (files.length !== paths.length) {
    await cleanupFiles(paths);
    return NextResponse.json({ error: "One or more files didn't upload correctly. Please try again." }, { status: 422 });
  }

  for (const file of files) {
    const err = validateFile(file);
    if (err) {
      await cleanupFiles(paths);
      return NextResponse.json({ error: `${err} Your answers are still here.` }, { status: 422 });
    }
  }
  const totalErr = validateTotalSize(files);
  if (totalErr) {
    await cleanupFiles(paths);
    return NextResponse.json({ error: `${totalErr} Your answers are still here.` }, { status: 422 });
  }

  const referenceNumber = generateReference();

  // Rename into personname_submissionid_date_filetype.filetype now that the reference
  // exists. The browser can't do this at upload time (no reference yet) and the Storage
  // rules pin client writes to their own anonymous-uid folder, so the Admin SDK — which
  // bypasses rules — moves them into a per-submission folder. A failed move leaves the
  // file at its original path, which is still recorded, so nothing is lost.
  if (files.length) {
    const adminBucket = getAdminBucket();
    const usedNames = new Set<string>();
    files = await Promise.all(
      files.map(async (file) => {
        const newName = buildFileName(values.fullName, referenceNumber, file.name, usedNames);
        const newPath = `pitch2product/${referenceNumber}/${newName}`;
        try {
          await adminBucket.file(file.path).move(newPath);
          return { ...file, name: newName, path: newPath };
        } catch (err) {
          console.error(`Pitch2Product: could not rename ${file.path} -> ${newPath}:`, err);
          return file;
        }
      }),
    );

    // Sign against the final paths. Expiring links rather than Firebase download URLs:
    // the bucket denies public reads, so a leaked link can't become a permanent open
    // door to an applicant's material. 7 days is the v4 maximum and covers the stated
    // 5–7 business day review; the stored `path` stays the durable reference.
    files = await Promise.all(
      files.map(async (file) => {
        try {
          const [url] = await adminBucket.file(file.path).getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
          return { ...file, url };
        } catch (err) {
          console.error(`Pitch2Product: could not sign URL for ${file.path}:`, err);
          return file;
        }
      }),
    );
  }

  try {
    const adminDb = getAdminDb();
    await adminDb.collection("pitch2productSubmissions").add({
      ...values,
      email,
      files,
      referenceNumber,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save your submission. Your answers are still here, so please try again." },
      { status: 500 },
    );
  }

  // Data is safely persisted at this point — an email failure below must never turn
  // this into an error response for the applicant.
  const consoleUrl = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/data`
    : "https://console.firebase.google.com";

  await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFY_EMAILS,
      subject: `New Pitch2Product submission: ${values.projectName}`,
      html: await render(
        AdminNotification({
          referenceNumber,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          applicantType: values.applicantType,
          city: values.city,
          projectName: values.projectName,
          ideaDescription: values.ideaDescription,
          currentStage: values.currentStage,
          timeline: values.timeline,
          budget: values.budget,
          files: files.map((f) => ({ name: f.name, url: f.url, description: f.description })),
          consoleUrl,
        }),
      ),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: [values.email],
      subject: `We've received your idea — reference ${referenceNumber}`,
      html: await render(
        ApplicantConfirmation({
          referenceNumber,
          firstName: firstName(values.fullName),
          projectName: values.projectName,
          contactEmail: PRIMARY_NOTIFY_EMAIL,
        }),
      ),
    }),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(`Pitch2Product email ${i === 0 ? "(admin)" : "(applicant)"} failed:`, r.reason);
    });
  });

  return NextResponse.json({ referenceNumber }, { status: 201 });
}
