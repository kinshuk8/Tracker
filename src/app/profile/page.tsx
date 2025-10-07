"use client";

import { SignedIn, UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <SignedIn>
      <div className="min-h-screen flex items-center justify-center py-24 px-4">
        <UserProfile />
      </div>
    </SignedIn>
  );
}
