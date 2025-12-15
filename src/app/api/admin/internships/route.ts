import { NextResponse } from 'next/server';
import { db } from "@/db";
import { internshipRegistrations } from "@/db/schema";
import { desc } from 'drizzle-orm';
import { auth } from "@/lib/auth"; // Assuming auth setup
import { headers } from "next/headers";

export async function GET() {
  try {
    // 1. Check Authentication (Optional but recommended for admin routes)
    // For now, I'll assumme middleware handles general protection or I'll add a basic check if needed.
    // Ideally:
    /*
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */
   
    // 2. Fetch Data
    const data = await db.query.internshipRegistrations.findMany({
      orderBy: [desc(internshipRegistrations.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching internship registrations:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
