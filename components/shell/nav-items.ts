import { ArrowLeftRight, House, PiggyBank, Tags, Wallet } from "lucide-react";

export const navItems = {
  home: { href: "/", label: "Inicio", icon: House, monthly: true },
  movements: { href: "/movimientos", label: "Movimientos", icon: ArrowLeftRight, monthly: true },
  budget: { href: "/presupuesto", label: "Presupuesto", icon: PiggyBank, monthly: true },
  accounts: { href: "/cuentas", label: "Cuentas", icon: Wallet, monthly: false },
  categories: { href: "/categorias", label: "Categorías", icon: Tags, monthly: false },
};

export type NavItemName = keyof typeof navItems;

export const sidebarNav: NavItemName[] = ["home", "movements", "budget", "accounts", "categories"];
export const moreNav: NavItemName[] = ["accounts", "categories"];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
