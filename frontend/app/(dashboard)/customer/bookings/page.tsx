"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { BookingCard } from "@/app/components/shared/BookingCard";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { useCustomerBookings } from "@/app/hooks/useBookings";

const tabs = ["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"] as const;

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("ALL");
  const { data, isLoading } = useCustomerBookings();

  const bookings = useMemo(() => {
    const items = data ?? [];
    return activeTab === "ALL" ? items : items.filter((booking) => booking.status === activeTab);
  }, [activeTab, data]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
          Customer bookings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Track every booking in one place</h1>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Monitor pending requests, active escrow jobs, and completed work without leaving the dashboard.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? "border-[#14b8a6] bg-[#f0fdfa] text-[#0f766e]"
                : "border-[#e5e7eb] bg-white text-[#6b7280]"
            }`}
          >
            {tab === "ALL" ? "All" : tab}
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
          title="No bookings in this state"
          description="Bookings you create will appear here, along with their escrow and completion status."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} href={`/customer/bookings/${booking.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
