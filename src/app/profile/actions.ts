"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  if (!user || !user.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  try {
    await db.update(users)
      .set({
        name,
        phoneNumber,
        updatedAt: new Date(),
      })
      .where(eq(users.email, user.email));

    revalidatePath("/profile");
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}
