import { ArrowLeftRight, CreditCard, House, PiggyBank, Tags, Target, Wallet } from "lucide-react";

export const navItems = {
  home: { href: "/", label: "Inicio", icon: House, monthly: true },
  movements: { href: "/movimientos", label: "Movimientos", icon: ArrowLeftRight, monthly: true },
  budget: { href: "/presupuesto", label: "Presupuesto", icon: PiggyBank, monthly: true },
  goals: { href: "/metas", label: "Metas", icon: Target, monthly: false },
  accounts: { href: "/cuentas", label: "Cuentas", icon: Wallet, monthly: false },
  cards: { href: "/tarjetas", label: "Tarjetas", icon: CreditCard, monthly: false },
  categories: { href: "/categorias", label: "Categorías", icon: Tags, monthly: false },
};

export type NavItemName = keyof typeof navItems;

export type NavHrefs = Partial<Record<NavItemName, string>>;

export const sidebarNav: NavItemName[] = ["home", "movements", "budget", "goals", "accounts", "cards", "categories"];
export const moreNav: NavItemName[] = ["goals", "accounts", "cards", "categories"];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
