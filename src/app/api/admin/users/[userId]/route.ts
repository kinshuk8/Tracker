import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, enrollments, userProgress, accounts, sessions, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Perform cascade delete manually (or rely on DB cascade if configured, but manual is safer here)
    // 1. Delete Progress
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
    
    // 2. Delete Enrollments
    await db.delete(enrollments).where(eq(enrollments.userId, userId));
    
    // 3. Delete Payments
    await db.delete(payments).where(eq(payments.userId, userId));

    // 4. Delete Auth Accounts & Sessions
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // 5. Delete User
    const deletedUser = await db.delete(users).where(eq(users.id, userId)).returning();

    if (!deletedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
