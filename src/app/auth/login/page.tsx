import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <SignIn routing="path" path="/auth/login" afterSignInUrl="/" />
    </div>
  );
}
