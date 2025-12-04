"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]?.emailAddress) {
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
      .where(eq(users.email, user.emailAddresses[0].emailAddress));

    revalidatePath("/profile");
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}
