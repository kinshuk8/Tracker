"use client";

import { AnimatePresence, motion } from "framer-motion";
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
} from "@/lib/pitch2product/options";
import type { FieldErrors, FieldName, FormValues } from "@/lib/pitch2product/schema";
import { ChipSelect, ChoiceCards, LongTextField, Reaction, StepIntro, SubSection, TextField } from "./fields";

export type StepProps = {
  values: FormValues;
  errors: FieldErrors;
  set: <K extends FieldName>(key: K, value: FormValues[K]) => void;
};

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";

function Conditional({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const APPLICANT_REACTIONS: Record<string, string> = {};

export function StepApplicant({ values: v, errors: e, set }: StepProps) {
  const isStudent = v.applicantType === "STUDENT";
  return (
    <div className="space-y-6">
      <StepIntro
        title="A few details about you"
        subtitle="We'll use these details to contact you about your submission."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="fullName" label="Full name" required autoComplete="name" placeholder="e.g. Priya Sharma"
          value={v.fullName} onChange={(x) => set("fullName", x)} error={e.fullName} />
        <TextField id="email" label="Email" type="email" required autoComplete="email" placeholder="e.g. priya@gmail.com"
          value={v.email} onChange={(x) => set("email", x)} error={e.email} />
        <TextField id="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="e.g. +91 98765 43210"
          value={v.phone} onChange={(x) => set("phone", x)} error={e.phone} />
        <TextField id="city" label="City" required autoComplete="address-level2" placeholder="Your city"
          value={v.city} onChange={(x) => set("city", x)} error={e.city} />
      </div>

      <ChoiceCards id="applicantType" label="Which best describes you?" required options={APPLICANT_TYPES}
        value={v.applicantType} onChange={(x) => set("applicantType", x)} error={e.applicantType} />
      <Reaction message={APPLICANT_REACTIONS[v.applicantType]} />

      <Conditional show={isStudent}>
        <SubSection title="Student details">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="collegeName" label="College name" required placeholder="e.g. St. Joseph's College"
              value={v.collegeName} onChange={(x) => set("collegeName", x)} error={e.collegeName} />
            <TextField id="course" label="Course" required placeholder="e.g. B.Tech CSE or BBA"
              value={v.course} onChange={(x) => set("course", x)} error={e.course} />
            <TextField id="studentTeamSize" label="Team size" required inputMode="numeric" placeholder="e.g. 3"
              hint="Count yourself too." value={v.studentTeamSize} onChange={(x) => set("studentTeamSize", x)}
              error={e.studentTeamSize} />
          </div>
          <ChipSelect id="yearOfStudy" label="Year of study" required options={YEARS_OF_STUDY}
            value={v.yearOfStudy} onChange={(x) => set("yearOfStudy", x as string)} error={e.yearOfStudy} />
        </SubSection>
      </Conditional>

      <SubSection title="Company and online profiles">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField id="companyName" label={isStudent ? "Startup / team name" : "Company name"} autoComplete="organization"
            value={v.companyName} onChange={(x) => set("companyName", x)} error={e.companyName} />
          <TextField id="linkedinUrl" label="LinkedIn" type="url" placeholder="https://linkedin.com/in/…"
            value={v.linkedinUrl} onChange={(x) => set("linkedinUrl", x)} error={e.linkedinUrl} />
          <TextField id="profileWebsiteUrl" label="Website" type="url" placeholder="https://…"
            value={v.profileWebsiteUrl} onChange={(x) => set("profileWebsiteUrl", x)} error={e.profileWebsiteUrl} />
          <TextField id="otherProfileUrl" label="Other profile" type="url" placeholder="e.g. GitHub or portfolio"
            value={v.otherProfileUrl} onChange={(x) => set("otherProfileUrl", x)} error={e.otherProfileUrl} />
        </div>
      </SubSection>
    </div>
  );
}

export function StepIdea({ values: v, errors: e, set }: StepProps) {
  const name = firstName(v.fullName);
  return (
    <div className="space-y-6">
      <StepIntro
        title={name ? `${name}, what are you building?` : "What are you building?"}
        subtitle="Write it the way you'd explain it to a friend. Simple English is fine."
      />
      <TextField id="projectName" label="Project / startup name" required placeholder="e.g. KiranaBook (working title)"
        value={v.projectName} onChange={(x) => set("projectName", x)} error={e.projectName} />
      <LongTextField id="ideaDescription" label="Describe your idea" required minLength={20} rows={5}
        placeholder="Explain your idea in your own words. What are you trying to build?"
        value={v.ideaDescription} onChange={(x) => set("ideaDescription", x)} error={e.ideaDescription} />
      <LongTextField id="problemStatement" label="What problem are you solving?" required minLength={20}
        placeholder="e.g. Shop owners track customer credit in notebooks and lose entries."
        value={v.problemStatement} onChange={(x) => set("problemStatement", x)} error={e.problemStatement} />
      <div className="grid gap-6 lg:grid-cols-2">
        <LongTextField id="affectedUsers" label="Who experiences this problem?"
          placeholder="e.g. Kirana and medical shop owners in small towns."
          value={v.affectedUsers} onChange={(x) => set("affectedUsers", x)} error={e.affectedUsers} />
        <LongTextField id="targetCustomer" label="Who would use / pay for the product?" required minLength={5}
          placeholder="e.g. Shop owners, paying monthly"
          value={v.targetCustomer} onChange={(x) => set("targetCustomer", x)} error={e.targetCustomer} />
        <LongTextField id="currentSolution" label="How is this problem currently solved?"
          placeholder="e.g. A paper notebook and WhatsApp reminders"
          value={v.currentSolution} onChange={(x) => set("currentSolution", x)} error={e.currentSolution} />
        <LongTextField id="differentiator" label="What makes your solution different?"
          placeholder="e.g. Works offline, so kirana shop owners can use it without steady internet."
          value={v.differentiator} onChange={(x) => set("differentiator", x)} error={e.differentiator} />
      </div>

      <ChipSelect id="industries" label="Industry" hint="Select all that apply." options={INDUSTRIES}
        value={v.industries} onChange={(x) => set("industries", x as string[])} error={e.industries} />
      <Conditional show={v.industries.includes("OTHER")}>
        <TextField id="industryOther" label="Other industry" required placeholder="e.g. Textiles and handloom"
          value={v.industryOther} onChange={(x) => set("industryOther", x)} error={e.industryOther} />
      </Conditional>
    </div>
  );
}

const STAGE_REACTIONS: Record<string, string> = {
  BUSINESS_PLAN: "You can upload the plan or add a link in the last step.",
  PITCH_DECK: "You can upload the deck or add a link in the last step.",
  FIGMA_DESIGN: "You can add your Figma link in the last step.",
};

export function StepStage({ values: v, errors: e, set }: StepProps) {
  const launched = LAUNCHED_STAGES.includes(v.currentStage);
  return (
    <div className="space-y-6">
      <StepIntro
        title="Where is your idea today?"
        subtitle="Pick the stage that fits best. You can submit even if it's only an idea for now."
      />
      <ChoiceCards id="currentStage" label="Current stage" required options={STAGES}
        columns="sm:grid-cols-2" value={v.currentStage} onChange={(x) => set("currentStage", x)}
        error={e.currentStage} />
      <Reaction message={STAGE_REACTIONS[v.currentStage]} />

      <Conditional show={launched}>
        <SubSection title="Product details">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="productUrl" label="Product URL" type="url" placeholder="https://…"
              value={v.productUrl} onChange={(x) => set("productUrl", x)} error={e.productUrl} />
            <TextField id="productDemoUrl" label="Demo URL" type="url" placeholder="https://…"
              value={v.productDemoUrl} onChange={(x) => set("productDemoUrl", x)} error={e.productDemoUrl} />
            <TextField id="monthlyActiveUsers" label="Monthly active users" inputMode="numeric" placeholder="e.g. 250"
              value={v.monthlyActiveUsers} onChange={(x) => set("monthlyActiveUsers", x)}
              error={e.monthlyActiveUsers} />
          </div>
        </SubSection>
      </Conditional>

      <SubSection title="Traction">
        <ChipSelect id="hasUsers" label="Do you currently have users?" required options={YES_NO}
          value={v.hasUsers} onChange={(x) => set("hasUsers", x as string)} error={e.hasUsers} />
        <Conditional show={v.hasUsers === "YES"}>
          <TextField id="userCount" label="Roughly how many users?" required inputMode="numeric" placeholder="e.g. 400"
            value={v.userCount} onChange={(x) => set("userCount", x)} error={e.userCount} />
        </Conditional>

        <ChipSelect id="hasRevenue" label="Do you currently generate revenue?" required options={YES_NO}
          value={v.hasRevenue} onChange={(x) => set("hasRevenue", x as string)} error={e.hasRevenue} />
        <Conditional show={v.hasRevenue === "YES"}>
          <ChipSelect id="revenueRange" label="Monthly revenue" required options={REVENUE_RANGES}
            value={v.revenueRange} onChange={(x) => set("revenueRange", x as string)} error={e.revenueRange} />
        </Conditional>

        <ChipSelect id="hasInvestment" label="Have you already invested money into this project?" required
          options={YES_NO} value={v.hasInvestment} onChange={(x) => set("hasInvestment", x as string)}
          error={e.hasInvestment} />
        <Conditional show={v.hasInvestment === "YES"}>
          <ChipSelect id="investmentRange" label="Roughly how much?" required options={INVESTMENT_RANGES}
            value={v.investmentRange} onChange={(x) => set("investmentRange", x as string)}
            error={e.investmentRange} />
        </Conditional>

        <ChipSelect id="technicalTeam" label="Do you currently have a technical team?" required options={TECH_TEAM}
          value={v.technicalTeam} onChange={(x) => set("technicalTeam", x as string)} error={e.technicalTeam} />
      </SubSection>
    </div>
  );
}

export function StepRequirements({ values: v, errors: e, set }: StepProps) {
  const isStudent = v.applicantType === "STUDENT";
  const budgets = isStudent ? [...STUDENT_BUDGETS, ...BUDGETS] : BUDGETS;
  const count = v.requirements.length;

  return (
    <div className="space-y-6">
      <StepIntro
        title="What you need and when"
        subtitle="Your answers help us see what kind of work is involved when we review your submission."
      />
      <ChipSelect id="requirements" label="What do you need?" required hint="Select all that apply."
        options={REQUIREMENTS} value={v.requirements} onChange={(x) => set("requirements", x as string[])}
        error={e.requirements} />
      <Reaction
        message={
          count >= 5
            ? ""
            : count > 0
              ? ""
              : null
        }
      />

      <ChipSelect id="timeline" label="When would you like to start?" required options={TIMELINES}
        value={v.timeline} onChange={(x) => set("timeline", x as string)} error={e.timeline} />

      <ChipSelect id="budget" label="Budget" required options={budgets}
        hint={isStudent ? "Student projects are welcome, even if you don't have a budget yet." : "A rough range is enough."}
        value={v.budget} onChange={(x) => set("budget", x as string)} error={e.budget} />

      <ChipSelect id="preferredCollaboration" label="Preferred collaboration" options={COLLABORATION}
        hint="This only tells us your preference. It isn't a commitment."
        value={v.preferredCollaboration}
        onChange={(x) => set("preferredCollaboration", x === v.preferredCollaboration ? "" : (x as string))}
        error={e.preferredCollaboration} />
    </div>
  );
}
