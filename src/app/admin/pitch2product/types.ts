export interface Pitch2ProductFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  description?: string;
}

export interface Pitch2ProductSubmission {
  id: string;
  referenceNumber: string;
  createdAt: string | null;
  
  // Applicant details
  fullName: string;
  email: string;
  phone: string;
  city: string;
  applicantType: string;
  companyName?: string;
  linkedinUrl?: string;
  profileWebsiteUrl?: string;
  otherProfileUrl?: string;
  collegeName?: string;
  course?: string;
  yearOfStudy?: string;
  studentTeamSize?: string;

  // Project details
  projectName: string;
  ideaDescription: string;
  problemStatement?: string;
  affectedUsers?: string;
  targetCustomer?: string;
  currentSolution?: string;
  differentiator?: string;
  industries?: string[];
  industryOther?: string;

  // Stage & Traction
  currentStage: string;
  productUrl?: string;
  productDemoUrl?: string;
  monthlyActiveUsers?: string;
  hasUsers?: string;
  userCount?: string;
  hasRevenue?: string;
  revenueRange?: string;
  hasInvestment?: string;
  investmentRange?: string;
  technicalTeam?: string;

  // Requirements & Budget
  requirements?: string[];
  timeline?: string;
  budget?: string;
  preferredCollaboration?: string;

  // Files & Links
  files?: Pitch2ProductFile[];
  figmaUrl?: string;
  prototypeUrl?: string;
  websiteUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  otherUrl?: string;

  // Consents
  consentAccurate?: boolean;
  consentRights?: boolean;
  consentContact?: boolean;
}
