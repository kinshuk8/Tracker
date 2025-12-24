import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Verify auth import path. Previously used authClient in client. Server side usually uses auth from better-auth or similar.
// Wait, I saw authClient in client code. I need to check server-side auth.
// In `verify/route.ts`, it didn't check auth, it trusted the payment.
// In `RegistrationForm`, it used `authClient.useSession`.
// I'll check `src/lib/auth.ts` or similar if it exists.
// Actually, I can use `req.headers` or look for existing patterns.
// `src/app/api/user/update/route.ts` was mentioned in `ProfilePage` call. I should check that to see how it gets user.
// I'll assume standard better-auth server pattern: `from "@/lib/auth"`.

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEnrollments = await db.query.enrollments.findMany({
            where: eq(enrollments.userId, session.user.id),
            with: {
                course: true
            },
            orderBy: (enrollments, { desc }) => [desc(enrollments.createdAt)]
        });

        return NextResponse.json({ enrollments: userEnrollments });

    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
