"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Hammer,
  Paintbrush,
  Scissors,
  Search,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { useWallet } from "@/app/hooks/useWallet";
import { useBookings } from "@/app/hooks/useBookings";
import { getMockProviders } from "@/app/lib/mock-marketplace";
import { formatCurrency } from "@/app/lib/utils";
import { cn } from "@/app/lib/utils";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";

const CATEGORIES = [
  { id: "barber", label: "Barber", icon: Scissors },
  { id: "electrician", label: "Electrician", icon: Zap },
  { id: "plumber", label: "Plumber", icon: Wrench },
  { id: "tailor", label: "Tailor", icon: Scissors },
  { id: "hair_stylist", label: "Hair Stylist", icon: Sparkles },
  { id: "carpenter", label: "Carpenter", icon: Hammer },
  { id: "cleaner", label: "Cleaner", icon: Trash2 },
  { id: "event_planner", label: "Event Planner", icon: Sparkles },
  { id: "caterer", label: "Caterer", icon: Utensils },
  { id: "painter", label: "Painter", icon: Paintbrush },
];

export default function CustomerHomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: wallet } = useWallet("customer");
  const { data: bookings } = useBookings("customer");
  const [searchQuery, setSearchQuery] = useState("");

  const artisansNearYou = getMockProviders().slice(0, 6);
  const recentBookings = (bookings || []).filter((booking) => booking.status !== "CANCELLED").slice(0, 3);
  const unreadCount = 3;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-8 pb-12 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Good morning, {user?.firstName || "Amaka"} 👋
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/wallet"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 shadow-sm transition hover:shadow-md"
          >
            <Wallet className="h-4 w-4 text-[var(--color-brand)]" />
            <span className="text-sm font-bold text-[var(--foreground)]">
              {formatCurrency(wallet?.availableBalance || 0)}
            </span>
          </Link>
          <Link
            href="/customer/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white shadow-sm transition hover:shadow-md"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5 text-[var(--color-ink-muted)]" />
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          </Link>
        </div>
      </div>

      <section className="relative">
        <form onSubmit={handleSearch} className="group relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-ink-muted)] transition-colors group-focus-within:text-brand" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe what you need - e.g. fix my kitchen pipe in Yaba."
            className="h-16 w-full rounded-lg border border-[var(--color-line)] bg-white pl-14 pr-4 text-lg shadow-sm outline-none transition-all focus:border-brand focus:ring-4 focus:ring-[#ecfdf5]"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-brand px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-strong"
          >
            Search
          </button>
        </form>
      </section>

      <section>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${encodeURIComponent(cat.id)}`}
              className="flex flex-none items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm shadow-sm transition hover:border-[var(--color-brand)] hover:shadow-md"
            >
              <cat.icon className="h-4 w-4 text-[var(--color-brand)]" />
              <span className="font-semibold text-[var(--foreground)]">{cat.label}</span>
            </Link>
          ))}
          <Link
            href="/search"
            className="flex flex-none items-center gap-2 rounded-full border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand)]"
          >
            <span>More +</span>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Artisans near you</h2>
          <Link href="/search" className="text-sm font-bold text-[var(--color-brand)] flex items-center gap-1">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {artisansNearYou.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="group relative overflow-hidden rounded-xl border border-[var(--color-line)] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute right-3 top-3">
                <ScoreBadge tier={provider.tier} />
              </div>
              <div className="flex gap-3">
                {provider.avatarUrl ? (
                  <img 
                    src={provider.avatarUrl} 
                    alt={provider.name}
                    className="h-16 w-16 flex-none rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 flex-none rounded-lg bg-[var(--color-surface)]" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-[var(--foreground)]">{provider.name}</p>
                  <span className="mt-1 inline-flex rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-ink-muted)]">
                    {provider.category}
                  </span>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {provider.rating}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--foreground)]">
                  {formatCurrency(provider.priceFrom)} - {formatCurrency(provider.priceTo)}
                </span>
                <span className="text-[var(--color-ink-muted)]">{provider.distanceKm} km</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recentBookings.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Recent bookings</h2>
            <Link href="/customer/bookings" className="text-sm font-bold text-[var(--color-brand)] flex items-center gap-1">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/customer/bookings/${booking.id}`}
                className="flex-none w-70 rounded-lg border border-[var(--color-line)] bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--foreground)]">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-bold text-[var(--foreground)]">{booking.serviceTitle}</p>
                    <p className="truncate text-xs text-[var(--color-ink-muted)]">{booking.providerName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    booking.status === "COMPLETED" ? "bg-[#ecfdf5] text-[#10b981]" :
                    booking.status === "ACCEPTED" ? "bg-[#f0f9ff] text-[#0ea5e9]" :
                    "bg-[#fff7ed] text-[#f59e0b]"
                  )}>
                    {booking.status === "ACCEPTED" ? "ACTIVE" : booking.status}
                  </span>
                  <span className="text-sm font-bold text-[var(--foreground)]">{formatCurrency(booking.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
