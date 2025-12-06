import { AppSidebar } from "@/components/dashboard/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 relative">
        <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
             style={{ 
                 backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", 
                 backgroundSize: "24px 24px" 
             }} 
        />
        <div className="relative z-10">
            {children}
        </div>
      </main>
    </div>
  );
}
