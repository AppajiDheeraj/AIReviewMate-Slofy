"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Render children only on the client and redirect unauthenticated users to /login.
 *
 * @param {{children: import('react').ReactNode}} props - The content to render when access is permitted.
 * @returns {import('react').ReactNode|null} The children when the component is mounted and access is allowed, or `null` while awaiting client mount.
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // 1️⃣ detect client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2️⃣ redirect if not logged in
  useEffect(() => {
    if (!isClient) return; // skip on server
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user && !storedUser) {
      router.push("/login");
    }
  }, [isClient, user, router]);

  // 3️⃣ render nothing (or a spinner) until we’re sure
  if (!isClient) return null;

  return children;
}