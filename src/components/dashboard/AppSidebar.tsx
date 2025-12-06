"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { User, Compass, LayoutDashboard, LogOut, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
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
      icon: <User className="h-5 w-5 flex-shrink-0" />,
    },
    {
        label: "Explore",
        href: "/dashboard/explore",
        icon: <Compass className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Back to Home",
      href: "/",
      icon: <Home className="h-5 w-5 flex-shrink-0" />,
    }
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col">
            <Link
                href="#"
                className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
            >
                <div className="h-6 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
                <span className="font-medium text-black dark:text-white whitespace-pre">
                    Tracker
                </span>
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: session?.user?.name || "User",
              href: "/dashboard/profile",
              icon: session?.user?.image ? (
                <Image
                  src={session.user.image}
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ) : (
                <div className="h-7 w-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border">
                  {session?.user?.name 
                    ? session.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() 
                    : "U"}
                </div>
              ),
            }}
          />
           <button onClick={handleSignOut} className="w-full text-left">
               <SidebarLink
                link={{
                    label: "Sign Out",
                    href: "#",
                    icon: <LogOut className="h-5 w-5 flex-shrink-0 text-red-500" />,
                }}
                className="text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
               />
           </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
