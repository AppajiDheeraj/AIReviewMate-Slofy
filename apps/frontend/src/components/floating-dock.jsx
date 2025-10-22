"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconCreditCard,
  IconClockHour4,
  IconLogout,
  IconLayoutDashboard,
  IconUser,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function FloatingDockDemo() {
  const { setOpen } = useSidebar();
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (href) => {
    if (href === "/logout") {
      logout(); // ✅ actually logs out
      return;
    }

    // Close sidebar for specific routes
    if (href === "/pricing" || href === "/waitlist") {
      setOpen(false);
    }

    router.push(href);
  };

  const links = [
    { title: "Dashboard", icon: <IconLayoutDashboard />, href: "/dashboard" },
    { title: "Pricing", icon: <IconCreditCard />, href: "/pricing" },
    { title: "Waitlist", icon: <IconClockHour4 />, href: "/waitlist" },
    { title: "Profile", icon: <IconUser />, href: "/profile" },
    { title: "GitHub", icon: <IconBrandGithub />, href: "https://github.com/AppajiDheeraj" },
    { title: "Logout", icon: <IconLogout />, href: "/login" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock
        items={links.map((link) => ({
          ...link,
          icon: (
            <button
              onClick={() => handleNavigation(link.href)}
              className="h-full w-full flex items-center justify-center"
            >
              {React.cloneElement(link.icon, {
                className:
                  "h-full w-full text-neutral-500 dark:text-neutral-300",
              })}
            </button>
          ),
        }))}
        mobileClassName="translate-y-0"
        desktopClassName="shadow-lg border border-gray-700 dark:border-neutral-800"
      />
    </div>
  );
}
