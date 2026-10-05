import { QuickAddButton } from "@/components/movements/quick-add-button";
import type { MovementFormData } from "@/lib/movements/queries";
import { MoreMenu } from "./more-menu";
import { NavLink } from "./nav-link";
import type { NavHrefs } from "./nav-items";

type BottomNavProps = {
  movementFormData: MovementFormData;
  navHrefs: NavHrefs;
};

export function BottomNav({ movementFormData, navHrefs }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <NavLink name="home" variant="bar" />
      <NavLink name="movements" variant="bar" />
      <QuickAddButton data={movementFormData} />
      <NavLink name="budget" variant="bar" />
      <MoreMenu navHrefs={navHrefs} />
    </nav>
  );
}
