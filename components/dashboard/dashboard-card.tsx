import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DashboardCardProps = {
  title: string;
  link?: { href: string; label: string };
  tone?: "default" | "brand";
  className?: string;
  children: ReactNode;
};

export function DashboardCard({ title, link, tone = "default", className, children }: DashboardCardProps) {
  const isBrand = tone === "brand";

  return (
    <section
      className={cn(
        "space-y-3 rounded-2xl px-5 py-4",
        isBrand ? "bg-green-700 text-cream-50" : "border border-border bg-surface",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className={cn("font-sans text-sm font-semibold", isBrand ? "text-green-100" : "text-muted")}>{title}</h2>
        {link && (
          <Link
            href={link.href}
            className={cn(
              "flex items-center gap-0.5 text-sm font-semibold underline-offset-4 hover:underline",
              isBrand ? "text-cream-50" : "text-primary",
            )}
          >
            {link.label}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}
