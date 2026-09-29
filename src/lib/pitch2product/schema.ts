import { z } from "zod";
import {
  APPLICANT_TYPES,
  BUDGETS,
  COLLABORATION,
  INDUSTRIES,
  INVESTMENT_RANGES,
  LAUNCHED_STAGES,
  REQUIREMENTS,
  REVENUE_RANGES,
  STAGES,
  STUDENT_BUDGETS,
  TECH_TEAM,
  TIMELINES,
  YEARS_OF_STUDY,
  YES_NO,
} from "./options";

export const STEPS = [
  { key: "applicant", title: "Applicant", short: "You" },
  { key: "idea", title: "Idea", short: "Idea" },
  { key: "stage", title: "Current Stage", short: "Stage" },
  { key: "requirements", title: "Requirements", short: "Needs" },
  { key: "material", title: "Supporting Material", short: "Material" },
] as const;

export const TOTAL_STEPS = STEPS.length;

export const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  applicantType: "",
  companyName: "",
  linkedinUrl: "",
  profileWebsiteUrl: "",
  otherProfileUrl: "",
  collegeName: "",
  course: "",
  yearOfStudy: "",
  studentTeamSize: "",

  projectName: "",
  ideaDescription: "",
  problemStatement: "",
  affectedUsers: "",
  targetCustomer: "",
  currentSolution: "",
  differentiator: "",
  industries: [] as string[],
  industryOther: "",

  currentStage: "",
  productUrl: "",
  productDemoUrl: "",
  monthlyActiveUsers: "",
  hasUsers: "",
  userCount: "",
  hasRevenue: "",
  revenueRange: "",
  hasInvestment: "",
  investmentRange: "",
  technicalTeam: "",

  requirements: [] as string[],
  timeline: "",
  budget: "",
  preferredCollaboration: "",

  figmaUrl: "",
  prototypeUrl: "",
  websiteUrl: "",
  demoUrl: "",
  githubUrl: "",
  youtubeUrl: "",
  otherUrl: "",
  consentAccurate: false,
  consentRights: false,
  consentContact: false,
};

export type FormValues = typeof defaultValues;
export type FieldName = keyof FormValues;
export type FieldErrors = Partial<Record<FieldName, string>>;

const isHttpUrl = (v: string) => {
  try {
    const url = new URL(v);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const required = (msg: string, max = 120) => z.string().trim().min(1, msg).max(max, `Please keep this under ${max} characters.`);
const optional = (max = 120) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const longText = (min: number, msg: string) =>
  z.string().trim().min(min, msg).max(2000, "Please keep this under 2000 characters.");
const optionalUrl = z
  .string()
  .trim()
  .max(500, "Please keep this link under 500 characters.")
  .refine((v) => v === "" || isHttpUrl(v), "Please enter the full link, starting with https://");
const count = (msg: string) => z.string().trim().regex(/^\d{1,9}$/, msg);
const choice = (opts: readonly { value: string }[], msg = "Please choose one.") =>
  z.enum(opts.map((o) => o.value) as [string, ...string[]], { error: msg });
const optionalChoice = (opts: readonly { value: string }[]) => z.union([z.literal(""), choice(opts)]);
const mustAgree = z.literal(true, { error: "Please tick this box before you submit." });

function stepSchema(step: number, v: FormValues) {
  switch (step) {
    case 0:
      return z.object({
        fullName: required("Please enter your full name.").min(2, "Please enter your full name."),
        email: z.email("Please check your email address. It should look like name@example.com."),
        phone: z
          .string()
          .trim()
          .regex(/^\+?[\d\s-]{7,18}$/, "Please enter your phone number, e.g. +91 98765 43210."),
        city: required("Please tell us which city you're based in."),
        applicantType: choice(APPLICANT_TYPES, "Please pick the option that best describes you."),
        companyName: optional(),
        linkedinUrl: optionalUrl,
        profileWebsiteUrl: optionalUrl,
        otherProfileUrl: optionalUrl,
        ...(v.applicantType === "STUDENT" && {
          collegeName: required("Please enter your college name.", 200),
          course: required("Please enter your course."),
          yearOfStudy: choice(YEARS_OF_STUDY, "Please select your year of study."),
          studentTeamSize: z
            .string()
            .trim()
            .regex(/^([1-9]|[1-4]\d|50)$/, "Please enter your team size, from 1 to 50."),
        }),
      });
    case 1:
      return z.object({
        projectName: required("Please give your project a name. A working name is fine."),
        ideaDescription: longText(20, "Please write at least 20 characters. A couple of sentences is enough."),
        problemStatement: longText(20, "Please describe the problem in at least 20 characters."),
        affectedUsers: optional(2000),
        targetCustomer: longText(5, "Please tell us who would use or pay for this."),
        currentSolution: optional(2000),
        differentiator: optional(2000),
        industries: z.array(choice(INDUSTRIES)).max(INDUSTRIES.length),
        ...(v.industries.includes("OTHER") && {
          industryOther: required("Please tell us which industry."),
        }),
      });
    case 2:
      return z.object({
        currentStage: choice(STAGES, "Please pick the stage that fits best."),
        ...(LAUNCHED_STAGES.includes(v.currentStage) && {
          productUrl: optionalUrl,
          productDemoUrl: optionalUrl,
          monthlyActiveUsers: z.union([z.literal(""), count("Please enter a number, digits only.")]),
        }),
        hasUsers: choice(YES_NO),
        ...(v.hasUsers === "YES" && { userCount: count("Please enter roughly how many users, in digits.") }),
        hasRevenue: choice(YES_NO),
        ...(v.hasRevenue === "YES" && { revenueRange: choice(REVENUE_RANGES, "Please pick a revenue range.") }),
        hasInvestment: choice(YES_NO),
        ...(v.hasInvestment === "YES" && {
          investmentRange: choice(INVESTMENT_RANGES, "Please pick an investment range."),
        }),
        technicalTeam: choice(TECH_TEAM),
      });
    case 3:
      return z.object({
        requirements: z.array(choice(REQUIREMENTS)).min(1, "Please pick at least one thing you need help with."),
        timeline: choice(TIMELINES, "Please tell us when you'd like to start."),
        budget: choice([...BUDGETS, ...STUDENT_BUDGETS], "Please pick the option closest to your situation."),
        preferredCollaboration: optionalChoice(COLLABORATION),
      });
    default:
      return z.object({
        figmaUrl: optionalUrl,
        prototypeUrl: optionalUrl,
        websiteUrl: optionalUrl,
        demoUrl: optionalUrl,
        githubUrl: optionalUrl,
        youtubeUrl: optionalUrl,
        otherUrl: optionalUrl,
        consentAccurate: mustAgree,
        consentRights: mustAgree,
        consentContact: mustAgree,
      });
  }
}

export function validateStep(step: number, v: FormValues): FieldErrors {
  const result = stepSchema(step, v).safeParse(v);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as FieldName;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateAll(v: FormValues): FieldErrors {
  return STEPS.reduce<FieldErrors>((acc, _, i) => ({ ...acc, ...validateStep(i, v) }), {});
}

export const STEP_REQUIRED: Record<number, (v: FormValues) => FieldName[]> = {
  0: (v) => [
    "fullName",
    "email",
    "phone",
    "city",
    "applicantType",
    ...(v.applicantType === "STUDENT"
      ? (["collegeName", "course", "yearOfStudy", "studentTeamSize"] as FieldName[])
      : []),
  ],
  1: () => ["projectName", "ideaDescription", "problemStatement", "targetCustomer"],
  2: (v) => [
    "currentStage",
    "hasUsers",
    "hasRevenue",
    "hasInvestment",
    "technicalTeam",
    ...(v.hasUsers === "YES" ? (["userCount"] as FieldName[]) : []),
    ...(v.hasRevenue === "YES" ? (["revenueRange"] as FieldName[]) : []),
    ...(v.hasInvestment === "YES" ? (["investmentRange"] as FieldName[]) : []),
  ],
  3: () => ["requirements", "timeline", "budget"],
  4: () => ["consentAccurate", "consentRights", "consentContact"],
};

export function stepCompletion(step: number, v: FormValues) {
  const fields = STEP_REQUIRED[step](v);
  const filled = fields.filter((f) => {
    const val = v[f];
    return Array.isArray(val) ? val.length > 0 : typeof val === "boolean" ? val : val.trim() !== "";
  });
  return fields.length ? filled.length / fields.length : 1;
}

// Shape of an uploaded file once it's on Firebase Storage — this, not the raw File
// object, is what travels from the browser to /api/pitch2product and into Firestore.
export type FileRef = {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  description: string;
};

export const FILE_RULES = {
  // No cap on how many files — only on their combined size. A single file is
  // implicitly capped at the total too, since it can't exceed it on its own.
  maxTotalSizeMb: 10,
  accept: ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
  mimeByExt: {
    pdf: ["application/pdf"],
    ppt: ["application/vnd.ms-powerpoint"],
    pptx: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    doc: ["application/msword"],
    docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    xls: ["application/vnd.ms-excel"],
    xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    png: ["image/png"],
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
  } as Record<string, string[]>,
};

// Some OSes report Office files with an empty or generic MIME type, so those pass on extension alone.
const GENERIC_MIME = ["", "application/octet-stream"];

export function validateFile(file: { name: string; size: number; type: string }): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed = FILE_RULES.mimeByExt[ext];
  if (!allowed) return `${file.name}: please upload a PDF, Word, PowerPoint, Excel, PNG or JPG file.`;
  if (!allowed.includes(file.type) && !GENERIC_MIME.includes(file.type)) {
    return `${file.name}: the file type doesn't match its name (e.g. .pdf, .docx). Please save it again and re-upload.`;
  }
  if (file.size === 0) return `${file.name}: this file is empty. Please pick another.`;
  return null;
}

// Authoritative "any number of files, ~10MB combined" check — used identically on the
// client (StepMaterial.tsx, for instant feedback), in the Firebase Storage upload
// security rules (storage.rules, a per-file backstop only), and server-side in
// /api/pitch2product (the real gate, checked against each file's actual stored size).
export function validateTotalSize(files: { size: number }[]): string | null {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > FILE_RULES.maxTotalSizeMb * 1024 * 1024) {
    return `Your files add up to more than ${FILE_RULES.maxTotalSizeMb} MB combined. Please remove something and try again.`;
  }
  return null;
}
