import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-aceternity";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Library,
  LogOut,
  CreditCard,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    redirect("/");
  }
  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Internships",
      href: "/admin/internships",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: (
        <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "S3 Files",
      href: "/admin/s3files",
      icon: (
        <Library className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Coupons",
      href: "/admin/coupons",
      icon: (
        <TicketPercent className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Enrollments",
      href: "/admin/enrollments",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: (
        <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "New Enrollment",
      href: "/admin/enroll/new",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-900 w-full flex-1 mx-auto border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-2 mb-8 px-2 py-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                A
              </div>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                Admin Portal
              </span>
            </Link>
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Back to Site",
                href: "/",
                icon: (
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700">
        {children}
      </main>
    </div>
  );
}
