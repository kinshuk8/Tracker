import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { defaultValues, FILE_RULES, validateAll, validateFile, type FormValues } from "@/lib/pitch2product/schema";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateReference() {
  const bytes = randomBytes(6);
  return `P2P-${Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("")}`;
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "We couldn't read your submission. Your answers are still here, so please try again." }, { status: 400 });
  }

  let parsed: Partial<FormValues> & { fileDescriptions?: unknown };
  try {
    parsed = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return NextResponse.json({ error: "We couldn't read your submission. Your answers are still here, so please try again." }, { status: 400 });
  }

  const values: FormValues = { ...defaultValues };
  for (const key of Object.keys(defaultValues) as (keyof FormValues)[]) {
    if (key in parsed && typeof parsed[key] === typeof defaultValues[key]) {
      (values as Record<string, unknown>)[key] = parsed[key];
    }
  }

  const fieldErrors = validateAll(values);
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "Some answers need a change. Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length > FILE_RULES.maxFiles) {
    return NextResponse.json({ error: `Please upload ${FILE_RULES.maxFiles} files or fewer. Your answers are still here.` }, { status: 422 });
  }
  for (const file of files) {
    const fileError = validateFile(file);
    if (fileError) return NextResponse.json({ error: `${fileError} Your answers are still here.` }, { status: 422 });
  }

  // Persistence, private file storage and email notifications plug in here.
  const referenceNumber = generateReference();

  return NextResponse.json({ referenceNumber }, { status: 201 });
}
