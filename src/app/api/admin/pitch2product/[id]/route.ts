import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAdminDb, getAdminBucket } from "@/lib/firebase/admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const docRef = adminDb.collection("pitch2productSubmissions").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const data = docSnap.data();
    
    // Cleanup any uploaded files in Firebase Storage if path exists
    if (data?.files && Array.isArray(data.files)) {
      try {
        const adminBucket = getAdminBucket();
        await Promise.allSettled(
          data.files
            .filter((f: { path?: string }) => typeof f.path === "string" && f.path.startsWith("pitch2product/"))
            .map((f: { path: string }) => adminBucket.file(f.path).delete())
        );
      } catch (fileErr) {
        console.error("Pitch2Product Admin: Error deleting storage files:", fileErr);
      }
    }

    await docRef.delete();

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("Pitch2Product Admin: Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
