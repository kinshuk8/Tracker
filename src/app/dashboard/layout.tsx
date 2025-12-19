import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex-1 space-y-4 p-2 md:p-4 pt-0 relative">
             <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
                 style={{ 
                     backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", 
                     backgroundSize: "24px 24px" 
                 }} 
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
