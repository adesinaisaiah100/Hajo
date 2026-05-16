"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CalendarClock, ChevronRight } from "lucide-react";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { useCustomerBookings } from "@/app/hooks/useBookings";
import { cn, formatCurrency, formatLongDate } from "@/app/lib/utils";

const tabs = ["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"] as const;
const ACTIVE_STATUSES = ["ACCEPTED", "QUOTE_REQUESTED", "QUOTE_SENT", "NEGOTIATING"];

const statusClasses: Record<string, string> = {
  PENDING: "bg-[#fff7ed] text-[#9a3412]",
  QUOTE_REQUESTED: "bg-[#eff6ff] text-[#1d4ed8]",
  QUOTE_SENT: "bg-[#eef2ff] text-[#4338ca]",
  NEGOTIATING: "bg-[#f5f3ff] text-[#6d28d9]",
  ACCEPTED: "bg-[#ecfeff] text-[#0e7490]",
  COMPLETED: "bg-[#ecfdf5] text-[#047857]",
  CANCELLED: "bg-[#fef2f2] text-[#b91c1c]",
};

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("ACTIVE");
  const { data, isLoading } = useCustomerBookings();

  const allBookings = data ?? [];
  const tabCounts = {
    ACTIVE: allBookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status)).length,
    PENDING: allBookings.filter((booking) => booking.status === "PENDING").length,
    COMPLETED: allBookings.filter((booking) => booking.status === "COMPLETED").length,
    CANCELLED: allBookings.filter((booking) => booking.status === "CANCELLED").length,
  };

  const bookings = useMemo(() => {
    const items = data ?? [];
    if (activeTab === "ACTIVE") {
      return items.filter((booking) => ACTIVE_STATUSES.includes(booking.status));
    }
    return items.filter((booking) => booking.status === activeTab);
  }, [activeTab, data]);

  const emptyContent: Record<(typeof tabs)[number], { title: string; description: string }> = {
    ACTIVE: {
      title: "No active bookings",
      description: "Your in-progress jobs will show up here as soon as artisans accept your requests.",
    },
    PENDING: {
      title: "No pending bookings",
      description: "No pending bookings. Find an artisan to get started.",
    },
    COMPLETED: {
      title: "No completed bookings",
      description: "Your completed jobs will appear here.",
    },
    CANCELLED: {
      title: "No cancelled bookings",
      description: "Cancelled bookings will appear here when they happen.",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">My bookings</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)]"
            }`}
          >
            {tab}
            {(tab === "ACTIVE" || tab === "PENDING") && (
              <span className="ml-2 rounded-full bg-black/15 px-2 py-0.5 text-xs">
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} rows={5} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={emptyContent[activeTab].title}
          description={emptyContent[activeTab].description}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/customer/bookings/${booking.id}`}
              className="rounded-xl border border-[var(--color-line)] bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 flex-none rounded-lg bg-[var(--color-surface)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--foreground)]">{booking.providerName}</p>
                  <p className="truncate text-sm text-[var(--color-ink-muted)]">{booking.serviceTitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--color-ink-muted)]" />
              </div>

              <div className="mt-4 space-y-2 text-sm text-[var(--color-ink-muted)]">
                <p className="inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  {formatLongDate(booking.scheduledAt)}
                </p>
                <p className="font-semibold text-[var(--foreground)]">{formatCurrency(booking.amount)}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusClasses[booking.status])}>
                  {booking.status.replace("_", " ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
