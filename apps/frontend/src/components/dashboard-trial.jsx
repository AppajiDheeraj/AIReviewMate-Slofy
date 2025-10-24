"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { toast } from "sonner";

export function DashboardTrial() {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/credits?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setCredits(data.credits))
      .catch(() => toast.error("Failed to fetch credits"));
  }, [user]);

  if (!user) return null;

  return (
    <div className="border border-border/10 rounded-lg bg-white/5 flex flex-col gap-y-2">
      <div className="p-3 flex flex-col gap-y-4">
        <p className="text-sm font-medium">Credits</p>
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">{credits}/500 Credits</p>
          <Progress value={(credits / 500) * 100} />
        </div>
      </div>
      <Button
        asChild
        className="bg-transparent text-white border-t border-white/10 hover:bg-white/10 rounded-t-none"
      >
        <Link href="/pricing">Upgrade</Link>
      </Button>
    </div>
  );
}
