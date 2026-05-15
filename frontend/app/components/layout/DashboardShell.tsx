"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  Search,
  Wallet,
  LayoutDashboard,
  Wrench,
  BarChart3,
  Award,
  Lightbulb,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/store/auth.store";
import { VerificationBanner } from "@/app/components/shared/VerificationBanner";

const navigation = {
  customer: [
    { href: "/search", label: "Search", icon: Search },
    { href: "/customer/bookings", label: "Bookings", icon: BriefcaseBusiness },
    { href: "/customer/wallet", label: "Wallet", icon: Wallet },
    { href: "/customer/verification", label: "Trust Center", icon: ShieldCheck },
  ],
  provider: [
    { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/bookings", label: "Bookings", icon: BriefcaseBusiness },
    { href: "/provider/services", label: "Services", icon: Wrench },
    { href: "/provider/wallet", label: "Wallet", icon: CreditCard },
    { href: "/provider/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider/score", label: "Credit Score", icon: Award },
    { href: "/provider/verification", label: "Trust Center", icon: ShieldCheck },
    { href: "/provider/insights", label: "AI Insights", icon: Lightbulb },
    { href: "/provider/profile", label: "Profile", icon: User },
    { href: "/provider/settings", label: "Settings", icon: Settings },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: "customer" | "provider";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#f9fafb] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-[#e5e7eb] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#e5e7eb] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
            Hajo
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-[#f3f4f6] text-[#111827]"
                    : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e5e7eb] p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f9fafb] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#e5e7eb] text-[#111827]">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-[#111827]">
                {user?.firstName || "User"}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  user?.verificationTier === "TIER_0" ? "bg-amber-400" : "bg-[#10b981]"
                )} />
                <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                  {user?.verificationTier?.replace("_", " ") || "TIER 0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <VerificationBanner />
        <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {role === "customer" ? "Customer dashboard" : "Provider dashboard"}
              </p>
              <p className="text-sm text-[#6b7280]">
                {role === "customer"
                  ? "Search, book, and track escrow safely."
                  : "Respond to bookings and monitor wallet activity."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition hover:bg-[#f9fafb]">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
            {navigation[role].map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap",
                    active
                      ? "border-[#14b8a6] bg-[#f0fdfa] text-[#0f766e]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
