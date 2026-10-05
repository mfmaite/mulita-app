import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/brand/logo";
import { NewMovementButton } from "@/components/movements/new-movement-button";
import type { MovementFormData } from "@/lib/movements/queries";
import { NavLink } from "./nav-link";
import { sidebarNav, type NavHrefs } from "./nav-items";

type SidebarProps = {
  userName: string;
  movementFormData: MovementFormData;
  navHrefs: NavHrefs;
};

export function Sidebar({ userName, movementFormData, navHrefs }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-border bg-surface p-6 lg:flex">
      <Link href="/" className="flex items-center gap-3">
        <Logo size={44} />
        <span className="font-display text-2xl font-bold text-primary">Mulita</span>
      </Link>
      <NewMovementButton data={movementFormData} label="Crear movimiento" className="w-full" />
      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNav.map((name) => (
          <NavLink key={name} name={name} variant="sidebar" href={navHrefs[name]} />
        ))}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <span className="truncate text-sm font-medium">{userName}</span>
        <SignOutButton />
      </div>
    </aside>
  );
}
