"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, Package, ScrollText, ShoppingBag, Bot, Receipt, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** A path this item should also read as "active" for (e.g. the shop
   * itself has no separate top-level route beyond "/"). */
  match?: (pathname: string) => boolean;
}

const BUYER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Shop", href: "/", icon: ShoppingBag, match: (p) => p === "/" },
  { label: "My Agent", href: "/agents", icon: Bot },
  { label: "Orders", href: "/orders", icon: Receipt },
];

const MERCHANT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/merchant", icon: LayoutDashboard, match: (p) => p === "/merchant" },
  { label: "Orders", href: "/merchant/orders", icon: Receipt },
  { label: "Products", href: "/merchant/products", icon: Package },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Audit", href: "/audit", icon: ScrollText },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.match ? item.match(pathname) : pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        active ? "bg-accent text-white shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={15} />
      {item.label}
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const nav = user?.type === "merchant" ? MERCHANT_NAV : user?.type === "buyer" ? BUYER_NAV : [];
  const homeHref = user?.type === "merchant" ? "/merchant" : user?.type === "buyer" ? "/dashboard" : "/";

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-ink text-white shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-5">
            <Link href={homeHref} className="shrink-0 text-sm font-semibold tracking-tight text-white sm:text-base">
              <span className="mr-2 inline-block size-2 rounded-full bg-accent align-middle shadow-[0_0_12px_rgba(217,67,122,0.7)]" />
              AI Shopping app
            </Link>
            {nav.length > 0 && (
              <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto">
                {nav.map((item) => (
                  <NavLink key={item.label} item={item} pathname={pathname} />
                ))}
              </nav>
            )}
          </div>

          {user && (
              <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-2 text-sm sm:flex">
                <span className="max-w-48 truncate text-white/65">{user.email}</span>
                {user.role && (
                    <Badge variant="accent" className="font-mono text-[10px] uppercase tracking-wide">
                    {user.role}
                  </Badge>
                )}
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-white/75 transition-colors duration-150 hover:bg-white/10 hover:text-white"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Mrinali</span>
          <span>AI Shopping app <span className="px-1.5 text-accent">·</span> AI Merchant growth</span>
        </div>
      </footer>
    </div>
  );
}
