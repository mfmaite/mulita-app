"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { monthParam } from "@/lib/month";
import { isActivePath, navItems, type NavItemName } from "./nav-items";

const variants = {
  sidebar:
    "flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-green-900 hover:bg-cream-100 aria-[current=page]:bg-green-700 aria-[current=page]:text-cream-50",
  bar: "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-cream-700 aria-[current=page]:text-green-700",
};

type NavLinkProps = {
  name: NavItemName;
  variant: keyof typeof variants;
  href?: string;
};

export function NavLink({ name, variant, href: hrefOverride }: NavLinkProps) {
  const pathname = usePathname();
  const month = useSearchParams().get(monthParam);
  const { href, label, icon: Icon, monthly } = navItems[name];
  const target = hrefOverride ?? href;

  return (
    <Link
      href={monthly && month ? `${target}?${monthParam}=${month}` : target}
      aria-current={isActivePath(pathname, href) ? "page" : undefined}
      className={cn("transition-colors", variants[variant])}
    >
      <Icon className="size-5" aria-hidden />
      {label}
    </Link>
  );
}
