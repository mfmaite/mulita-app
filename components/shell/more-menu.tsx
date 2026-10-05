"use client";

import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "./nav-link";
import { isActivePath, moreNav, navItems, type NavHrefs } from "./nav-items";

function closeOnNavigate(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest("a")) event.currentTarget.hidePopover();
}

export function MoreMenu({ navHrefs }: { navHrefs: NavHrefs }) {
  const pathname = usePathname();
  const isActive = moreNav.some((name) => isActivePath(pathname, navItems[name].href));

  return (
    <>
      <button
        popoverTarget="more-menu"
        aria-current={isActive ? "page" : undefined}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-cream-700 aria-[current=page]:text-green-700"
      >
        <Ellipsis className="size-5" aria-hidden />
        Más
      </button>
      <div
        id="more-menu"
        popover="auto"
        onClick={closeOnNavigate}
        className="inset-auto right-3 bottom-20 m-0 min-w-52 space-y-1 rounded-2xl border border-border bg-surface p-2 shadow-xl backdrop:bg-green-950/30"
      >
        {moreNav.map((name) => (
          <NavLink key={name} name={name} variant="sidebar" href={navHrefs[name]} />
        ))}
        <div className="border-t border-border pt-1">
          <SignOutButton className="w-full justify-start rounded-xl px-3" />
        </div>
      </div>
    </>
  );
}
