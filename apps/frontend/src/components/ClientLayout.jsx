"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Client-side layout component that conditionally renders the application sidebar and its trigger based on the current route.
 *
 * Hides the sidebar and trigger for the "/pricing", "/waitlist", "/login", and "/signup" routes; otherwise renders them alongside the provided children.
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Content to render inside the layout.
 * @returns {JSX.Element} The layout element containing optional AppSidebar, optional SidebarTrigger, and the children content.
 */
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