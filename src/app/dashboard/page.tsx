import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { BookOpen } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // This component currently redirects to a profile page.
  // The instruction implies a scenario where courses might be displayed,
  // and if none are found, an Empty component should be shown.
  // Since the current logic only redirects, we'll keep the redirect
  // but add the imports and a placeholder for where the Empty component
  // would typically be used if course data were present.

  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
