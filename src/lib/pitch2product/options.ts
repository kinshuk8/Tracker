export type Option<T extends string = string> = { value: T; label: string; hint?: string };

export const APPLICANT_TYPES = [
  { value: "STUDENT", label: "Student", hint: "College project or startup idea" },
  { value: "FOUNDER", label: "Founder", hint: "Leading an idea or early startup" },
  { value: "COFOUNDER", label: "Co-founder", hint: "Part of a founding team" },
  { value: "BUSINESS_OWNER", label: "Business owner", hint: "Running an existing business" },
  { value: "PROFESSIONAL", label: "Professional", hint: "Working on a side idea" },
  { value: "OTHER", label: "Other", hint: "If none of these describe you" },
] as const satisfies readonly Option[];

export const YEARS_OF_STUDY = [
  { value: "1", label: "1st year" },
  { value: "2", label: "2nd year" },
  { value: "3", label: "3rd year" },
  { value: "4", label: "4th year" },
  { value: "5", label: "5th year" },
  { value: "PG", label: "Post-graduate" },
  { value: "GRADUATED", label: "Recently graduated" },
] as const satisfies readonly Option[];

export const INDUSTRIES = [
  { value: "AI_ML", label: "AI / ML" },
  { value: "SAAS", label: "SaaS" },
  { value: "FINTECH", label: "FinTech" },
  { value: "HEALTHTECH", label: "HealthTech" },
  { value: "EDTECH", label: "EdTech" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "B2B", label: "B2B" },
  { value: "CONSUMER", label: "Consumer" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "CYBERSECURITY", label: "Cybersecurity" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "OTHER", label: "Other" },
] as const satisfies readonly Option[];

export const STAGES = [
  {
    value: "IDEA",
    label: "An idea",
    hint: "Nothing built yet. Fine whether it's only in your head or you already have designs, a deck, user research or survey results.",
  },
  {
    value: "PROTOTYPE",
    label: "A prototype",
    hint: "Something exists to look at or click through — functional or not. Includes Figma prototypes, demos and early working versions.",
  },
  {
    value: "EXISTING_PRODUCT",
    label: "An existing product",
    hint: "Already built or live, and now needs improvements, new features, a rebuild or scaling up.",
  },
] as const satisfies readonly Option[];

// Stages where asking for a product/demo link and usage numbers actually makes sense.
export const LAUNCHED_STAGES: readonly string[] = ["PROTOTYPE", "EXISTING_PRODUCT"];

export const REVENUE_RANGES = [
  { value: "UNDER_1L_MONTH", label: "Under ₹1L / month" },
  { value: "1L_5L_MONTH", label: "₹1L – ₹5L / month" },
  { value: "5L_10L_MONTH", label: "₹5L – ₹10L / month" },
  { value: "10L_PLUS_MONTH", label: "₹10L+ / month" },
] as const satisfies readonly Option[];

export const INVESTMENT_RANGES = [
  { value: "BELOW_1L", label: "Below ₹1L" },
  { value: "1L_5L", label: "₹1L – ₹5L" },
  { value: "5L_10L", label: "₹5L – ₹10L" },
  { value: "10L_25L", label: "₹10L – ₹25L" },
  { value: "25L_PLUS", label: "₹25L+" },
] as const satisfies readonly Option[];

export const YES_NO = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
] as const satisfies readonly Option[];

export const TECH_TEAM = [
  { value: "YES", label: "Yes" },
  { value: "PARTIAL", label: "Partially" },
  { value: "NO", label: "No" },
] as const satisfies readonly Option[];

export const REQUIREMENTS = [
  { value: "IDEA_VALIDATION", label: "Idea validation" },
  { value: "TECHNICAL_FEASIBILITY", label: "Technical feasibility" },
  { value: "PRODUCT_STRATEGY", label: "Product strategy" },
  { value: "UI_UX", label: "UI / UX design" },
  { value: "PROTOTYPE", label: "Prototype" },
  { value: "INVESTOR_MVP", label: "Investor-ready MVP" },
  { value: "PRODUCTION_PRODUCT", label: "Production product" },
  { value: "WEB_APPLICATION", label: "Web application" },
  { value: "MOBILE_APPLICATION", label: "Mobile application" },
  { value: "AI_PRODUCT", label: "AI product" },
  { value: "AI_INTEGRATION", label: "AI integration" },
  { value: "SAAS", label: "SaaS platform" },
  { value: "AUTOMATION", label: "Automation" },
  { value: "API_BACKEND", label: "API / Backend" },
  { value: "CLOUD_INFRASTRUCTURE", label: "Cloud infrastructure" },
  { value: "EXISTING_PRODUCT_REDEVELOPMENT", label: "Rebuild existing product" },
  { value: "TECHNICAL_TEAM", label: "Technical team" },
  { value: "TECHNICAL_COFOUNDER", label: "Technical co-founder" },
] as const satisfies readonly Option[];

export const TIMELINES = [
  { value: "IMMEDIATELY", label: "Immediately" },
  { value: "WITHIN_1_MONTH", label: "Within 1 month" },
  { value: "1_TO_3_MONTHS", label: "1 – 3 months" },
  { value: "3_TO_6_MONTHS", label: "3 – 6 months" },
  { value: "6_PLUS_MONTHS", label: "6+ months" },
  { value: "EXPLORING", label: "Just exploring" },
] as const satisfies readonly Option[];

export const STUDENT_BUDGETS = [
  { value: "STUDENT_PROJECT", label: "It's a student project" },
  { value: "LOOKING_FOR_SPONSORSHIP", label: "Looking for sponsorship" },
] as const satisfies readonly Option[];

export const BUDGETS = [
  { value: "NOT_DECIDED", label: "Not decided yet" },
  { value: "BELOW_50K", label: "Below ₹50K" },
  { value: "50K_TO_2L", label: "₹50K – ₹2L" },
  { value: "2L_TO_5L", label: "₹2L – ₹5L" },
  { value: "5L_TO_10L", label: "₹5L – ₹10L" },
  { value: "10L_TO_25L", label: "₹10L – ₹25L" },
  { value: "25L_PLUS", label: "₹25L+" },
] as const satisfies readonly Option[];

// Hints deliberately mirror the hedged language used in the Collaboration section on
// the landing page: these describe what each arrangement *could* look like, and none
// of them is settled until the 1:1 discussion and a signed agreement.
export const COLLABORATION = [
  {
    value: "PAID_DEVELOPMENT",
    label: "Paid development",
    hint: "A conventional engagement: you fund the build, we develop it to an agreed scope and timeline.",
  },
  {
    value: "EQUITY_BASED",
    label: "Equity / stake",
    hint: "We contribute development and technical resources in exchange for an agreed stake, instead of full payment upfront.",
  },
  {
    value: "DEFERRED_PAYMENT",
    label: "Deferred payment",
    hint: "We start building now, with payment deferred until an agreed milestone such as your funding round.",
  },
  {
    value: "OPEN_TO_DISCUSSION",
    label: "Open to any of these",
    hint: "You'd consider any of the above — we'll suggest whichever fits the idea best.",
  },
  {
    value: "NOT_SURE",
    label: "Not sure yet",
    hint: "Perfectly fine. We'll walk you through the options on the call.",
  },
] as const satisfies readonly Option[];

export const LINK_FIELDS = [
  { key: "figmaUrl", label: "Figma", placeholder: "https://figma.com/file/..." },
  { key: "prototypeUrl", label: "Prototype", placeholder: "https://..." },
  { key: "websiteUrl", label: "Website", placeholder: "https://yourproduct.com" },
  { key: "demoUrl", label: "Demo", placeholder: "https://demo..." },
  { key: "githubUrl", label: "GitHub", placeholder: "https://github.com/..." },
  { key: "youtubeUrl", label: "YouTube / video", placeholder: "https://youtube.com/..." },
  { key: "otherUrl", label: "Other", placeholder: "https://..." },
] as const;
