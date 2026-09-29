/**
 * Renders the Pitch2Product emails to standalone HTML files so they can be eyeballed
 * (and opened in a browser / pasted into an email-client previewer) without needing
 * Resend credentials or actually sending anything.
 *
 *   npx tsx scripts/preview-emails.mjs   (or: node --experimental-strip-types ...)
 *
 * Output: .preview-emails/admin.html and .preview-emails/applicant.html
 */
import fs from "fs";
import path from "path";
import { render } from "@react-email/render";
import React from "react";

const outDir = path.join(process.cwd(), ".preview-emails");
fs.mkdirSync(outDir, { recursive: true });

const { default: AdminNotification } = await import("../src/emails/pitch2product/AdminNotification.tsx");
const { default: ApplicantConfirmation } = await import("../src/emails/pitch2product/ApplicantConfirmation.tsx");

const adminHtml = await render(
  React.createElement(AdminNotification, {
    referenceNumber: "P2P-GAFYZF",
    fullName: "Ramu Sanapala",
    email: "ramu@example.com",
    phone: "+91 98765 43210",
    applicantType: "FOUNDER",
    city: "Vijayawada",
    projectName: "Pitch2Product Vijayawada Pilot",
    ideaDescription:
      "A campaign platform that helps local businesses in tier-2 cities get a working product built without hiring a full technical team.",
    currentStage: "IDEA_ONLY",
    timeline: "IMMEDIATELY",
    budget: "NOT_DECIDED",
    files: [
      {
        name: "Pitch2Product_Vijayawada_Pilot_Campaign.pptx",
        url: "https://storage.googleapis.com/example-signed-url",
        description: "Latest deck, with the pilot plan",
      },
      { name: "budget-breakdown.xlsx", url: "https://storage.googleapis.com/example-signed-url-2", description: "" },
    ],
    consoleUrl: "https://console.firebase.google.com/project/pitch2product/firestore/data",
  }),
);

const applicantHtml = await render(
  React.createElement(ApplicantConfirmation, {
    referenceNumber: "P2P-GAFYZF",
    firstName: "Ramu",
    projectName: "Pitch2Product Vijayawada Pilot",
    contactEmail: "ramu@vmkedgemindsolutions.com",
  }),
);

fs.writeFileSync(path.join(outDir, "admin.html"), adminHtml);
fs.writeFileSync(path.join(outDir, "applicant.html"), applicantHtml);
console.log("Wrote:");
console.log(" ", path.join(outDir, "admin.html"));
console.log(" ", path.join(outDir, "applicant.html"));
