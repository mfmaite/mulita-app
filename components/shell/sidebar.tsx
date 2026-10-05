import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/brand/logo";
import { NavLink } from "./nav-link";
import { sidebarNav } from "./nav-items";

export function Sidebar({ userName }: { userName: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-border bg-surface p-6 lg:flex">
      <Link href="/" className="flex items-center gap-3">
        <Logo size={44} />
        <span className="font-display text-2xl font-bold text-primary">Mulita</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNav.map((name) => (
          <NavLink key={name} name={name} variant="sidebar" />
        ))}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <span className="truncate text-sm font-medium">{userName}</span>
        <SignOutButton />
      </div>
    </aside>
  );
}
