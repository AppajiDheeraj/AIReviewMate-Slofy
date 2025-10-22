"use client";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDownIcon, LogOutIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

export function DashboardUserButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 gap-x-2">
        <Avatar className="size-9 mr-3">
          <AvatarImage src={user.image || "https://github.com/shadcn.png"} />
          <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate">{user.name}</p>
          <p className="text-xs truncate">{user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-64 p-2 m-2">
        <DropdownMenuItem asChild>
          <Link href="/pricing">Billing <CreditCardIcon className="size-4 ml-auto" /></Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          Logout <LogOutIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
