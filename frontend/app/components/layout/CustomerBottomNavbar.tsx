"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BriefcaseBusiness, Wallet, User } from "lucide-react";
import { cn } from "@/app/lib/utils";

const customerNavigation = [
  { name: "Home", href: "/customer", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Bookings", href: "/customer/bookings", icon: BriefcaseBusiness },
  { name: "Wallet", href: "/customer/wallet", icon: Wallet },
  { name: "Profile", href: "/customer/profile", icon: User },
];

export function CustomerBottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {customerNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/customer";
          const homeActive = pathname === "/customer" && item.href === "/customer";

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                active || homeActive ? "text-[var(--color-brand)]" : "text-[var(--color-ink-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
