import Link from "next/link";
import { cn } from "@/lib/cn";
import { segmentItemClassName, segmentTrackClassName } from "./segmented-control";

type FilterTab = { label: string; href: string; isActive: boolean };

type FilterTabsProps = {
  label: string;
  tabs: FilterTab[];
};

export function FilterTabs({ label, tabs }: FilterTabsProps) {
  return (
    <nav aria-label={label} className={cn(segmentTrackClassName, "sm:w-fit")}>
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.isActive ? "page" : undefined}
          className={cn(
            segmentItemClassName,
            "py-1.5 sm:px-5 aria-[current=page]:bg-surface aria-[current=page]:text-green-800 aria-[current=page]:shadow-sm",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
