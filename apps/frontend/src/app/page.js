"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side page component that redirects authenticated users to the dashboard and unauthenticated users to the login page.
 *
 * While authentication state is being resolved it shows a centered "Redirecting..." message; once resolved it replaces the current history entry with either "/dashboard" (when a user exists) or "/login" (when no user exists).
 * @returns {JSX.Element} The page element that displays a centered "Redirecting..." message during navigation.
 */
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait for AuthContext to load

    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg animate-pulse">
        Redirecting...
      </p>
    </div>
  );
}