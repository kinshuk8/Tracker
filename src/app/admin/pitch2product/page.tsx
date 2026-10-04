import { getAdminDb, getAdminBucket } from "@/lib/firebase/admin";
import { Pitch2ProductStats } from "./components/Pitch2ProductStats";
import { Pitch2ProductTable } from "./components/Pitch2ProductTable";
import type { Pitch2ProductSubmission, Pitch2ProductFile } from "./types";

export const dynamic = "force-dynamic";

export default async function AdminPitch2ProductPage() {
  let submissions: Pitch2ProductSubmission[] = [];
  let fetchError: string | null = null;

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb
      .collection("pitch2productSubmissions")
      .orderBy("createdAt", "desc")
      .get();

    let adminBucket: ReturnType<typeof getAdminBucket> | null = null;
    try {
      adminBucket = getAdminBucket();
    } catch {
      // Bucket initialization error fallback
    }

    submissions = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Convert Firestore Timestamp to ISO string
        let createdAt: string | null = null;
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === "function") {
            createdAt = data.createdAt.toDate().toISOString();
          } else if (data.createdAt._seconds) {
            createdAt = new Date(data.createdAt._seconds * 1000).toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAt = data.createdAt;
          }
        }

        // Process files and refresh signed URLs if bucket is accessible
        let processedFiles: Pitch2ProductFile[] = [];
        if (Array.isArray(data.files)) {
          processedFiles = await Promise.all(
            data.files.map(async (file: Partial<Pitch2ProductFile>) => {
              let url = file.url || "";
              if (adminBucket && file.path) {
                try {
                  const [freshUrl] = await adminBucket.file(file.path).getSignedUrl({
                    version: "v4",
                    action: "read",
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                  });
                  url = freshUrl;
                } catch {
                  // Keep existing url if re-signing fails
                }
              }
              return {
                name: file.name || "Attachment",
                url,
                path: file.path || "",
                size: Number(file.size || 0),
                type: file.type || "",
                description: file.description || "",
              };
            })
          );
        }

        return {
          id: doc.id,
          referenceNumber: data.referenceNumber || `P2P-${doc.id.slice(0, 6).toUpperCase()}`,
          createdAt,
          fullName: data.fullName || "Unnamed Applicant",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          applicantType: data.applicantType || "OTHER",
          companyName: data.companyName,
          linkedinUrl: data.linkedinUrl,
          profileWebsiteUrl: data.profileWebsiteUrl,
          otherProfileUrl: data.otherProfileUrl,
          collegeName: data.collegeName,
          course: data.course,
          yearOfStudy: data.yearOfStudy,
          studentTeamSize: data.studentTeamSize,

          projectName: data.projectName || "Untitled Idea",
          ideaDescription: data.ideaDescription || "",
          problemStatement: data.problemStatement,
          affectedUsers: data.affectedUsers,
          targetCustomer: data.targetCustomer,
          currentSolution: data.currentSolution,
          differentiator: data.differentiator,
          industries: Array.isArray(data.industries) ? data.industries : [],
          industryOther: data.industryOther,

          currentStage: data.currentStage || "IDEA",
          productUrl: data.productUrl,
          productDemoUrl: data.productDemoUrl,
          monthlyActiveUsers: data.monthlyActiveUsers,
          hasUsers: data.hasUsers,
          userCount: data.userCount,
          hasRevenue: data.hasRevenue,
          revenueRange: data.revenueRange,
          hasInvestment: data.hasInvestment,
          investmentRange: data.investmentRange,
          technicalTeam: data.technicalTeam,

          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          timeline: data.timeline,
          budget: data.budget,
          preferredCollaboration: data.preferredCollaboration,

          files: processedFiles,
          figmaUrl: data.figmaUrl,
          prototypeUrl: data.prototypeUrl,
          websiteUrl: data.websiteUrl,
          demoUrl: data.demoUrl,
          githubUrl: data.githubUrl,
          youtubeUrl: data.youtubeUrl,
          otherUrl: data.otherUrl,

          consentAccurate: data.consentAccurate,
          consentRights: data.consentRights,
          consentContact: data.consentContact,
        };
      })
    );
  } catch (err: unknown) {
    console.error("Admin Pitch2Product: Error fetching submissions:", err);
    fetchError = err instanceof Error ? err.message : "Failed to load submissions from database";
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 dark:from-indigo-400 dark:to-blue-400">
            Pitch2Product
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review applicant ideas, pitch decks, traction, and technical requirements.
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm">
          <p className="font-semibold">Unable to fetch Pitch2Product registrations</p>
          <p className="text-xs mt-1 text-red-600 dark:text-red-300">{fetchError}</p>
        </div>
      )}

      {/* Stats Summary Cards */}
      <Pitch2ProductStats submissions={submissions} />

      {/* Submissions Table with Search & Details */}
      <Pitch2ProductTable initialSubmissions={submissions} />
    </div>
  );
}
