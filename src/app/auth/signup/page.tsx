import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <SignUp routing="path" path="/auth/signup" afterSignUpUrl="/" />
    </div>
  );
}
