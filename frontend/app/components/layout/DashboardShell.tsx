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
  Settings,
  Shield,
  Inbox,
  LogOut,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/store/auth.store";
import { VerificationBanner } from "@/app/components/shared/VerificationBanner";

const navigation = {
  customer: [
    { href: "/search", label: "Search", icon: Search },
    { href: "/customer/bookings", label: "Bookings", icon: BriefcaseBusiness },
    { href: "/customer/wallet", label: "Wallet", icon: Wallet },
    { href: "/customer/notifications", label: "Notifications", icon: Inbox },
    { href: "/customer/verification", label: "Trust Center", icon: Shield },
    { href: "/customer/profile", label: "Profile", icon: User },
    { href: "/customer/settings", label: "Settings", icon: Settings },
  ],
  provider: [
    { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/bookings", label: "Bookings", icon: BriefcaseBusiness },
    { href: "/provider/services", label: "Services", icon: Wrench },
    { href: "/provider/wallet", label: "Wallet", icon: CreditCard },
    { href: "/provider/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider/score", label: "Credit Score", icon: Award },
    { href: "/provider/verification", label: "Trust Center", icon: Shield },
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
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-[var(--color-line)] bg-white lg:flex lg:flex-col">
        {/* Brand Section */}
        <div className="border-b border-[var(--color-line)] px-6 py-6 space-y-1">
          <p className="text-lg font-bold text-[var(--foreground)]">Hajo</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand)]">
            {role === "customer" ? "Customer" : "Provider"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[var(--color-surface)] text-[var(--color-brand)] border-l-4 border-[var(--color-brand)] pl-3"
                    : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--foreground)] border-l-4 border-transparent",
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-[var(--color-brand)]" : "text-[var(--color-ink-muted)]"
                )} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="border-t border-[var(--color-line)] p-4">
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {user?.firstName || "User"}
                </p>
                <p className="truncate text-xs text-[var(--color-ink-muted)] mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-white hover:text-[var(--foreground)] transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col">
        <VerificationBanner />

        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-white/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
            {/* Left: Breadcrumb/Title */}
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-[var(--foreground)] truncate">
                {role === "customer" ? "Marketplace" : "Dashboard"}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {role === "customer" ? (
                <Link
                  href="/customer/notifications"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--foreground)] transition-all duration-200 relative"
                  aria-label="Open notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 bg-[#ef4444] rounded-full" />
                </Link>
              ) : (
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--foreground)] transition-all duration-200 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 bg-[#ef4444] rounded-full" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
