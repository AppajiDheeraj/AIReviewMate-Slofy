"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // 👇 Hide sidebar for these pages
  const hideSidebar =
    pathname === "/pricing" ||
    pathname === "/waitlist" ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <div className="relative min-h-screen w-full">
      {!hideSidebar && <AppSidebar />}
      {!hideSidebar && (
        <SidebarTrigger className="absolute top-3 left-3 z-50 b hover:bg-white/10 p-2 rounded-lg" />
      )}
      {children}
    </div>
  );
}
