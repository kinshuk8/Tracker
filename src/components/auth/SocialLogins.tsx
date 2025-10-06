"use client";

import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function SocialLogins() {
  const { signIn } = useSignIn();

  const oauthSignIn = async (strategy: OAuthStrategy) => {
    if (!signIn) return;
    await signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="flex w-full items-center">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => oauthSignIn("oauth_google")}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}
