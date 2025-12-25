"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User, Compass, LogOut, Home, GalleryVerticalEnd, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function AppSidebar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const links = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "Explore",
      href: "/dashboard/explore",
      icon: Compass,
    },
    {
      label: "Back to Home",
      href: "/",
      icon: Home,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6 group-data-[collapsible=icon]:!py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center">
              <Link href="#">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground bg-sidebar-primary">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight pl-3 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-base">Edge Mind</span>
                  <span className="truncate text-xs opacity-70">Solutions</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4 group-data-[collapsible=icon]:!p-0">
        <SidebarMenu className="space-y-3 group-data-[collapsible=icon]:space-y-2 group-data-[collapsible=icon]:items-center">
          {links.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label} className="h-12 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-xl group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center">
                <Link href={item.href} className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 opacity-70 group-data-[collapsible=icon]:!w-6 group-data-[collapsible=icon]:!h-6" />
                  <span className="font-medium text-base group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 pb-6 group-data-[collapsible=icon]:!p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                >
                    {session?.user?.image ? (
                        <Image
                        src={session.user.image}
                        className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        width={36}
                        height={36}
                        alt="Avatar"
                        />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                             {session?.user?.name 
                                ? session.user.name.split(" ").map((n, i, arr) => (i === 0 || i === arr.length - 1) ? n[0] : "").join("").toUpperCase() 
                                : "U"}
                        </div>
                    )}
                  <div className="grid flex-1 text-left text-sm leading-tight pl-2">
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{session?.user?.name || "User"}</span>
                    <span className="truncate text-xs text-slate-500">{session?.user?.email || ""}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
