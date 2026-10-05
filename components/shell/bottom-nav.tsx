import { MoreMenu } from "./more-menu";
import { NavLink } from "./nav-link";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <NavLink name="home" variant="bar" />
      <NavLink name="movements" variant="bar" />
      <NavLink name="budget" variant="bar" />
      <MoreMenu />
    </nav>
  );
}
