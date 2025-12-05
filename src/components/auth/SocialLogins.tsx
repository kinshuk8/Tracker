"use client";

import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function SocialLogins() {
  const oauthSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex w-full items-center">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => oauthSignIn()}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}
