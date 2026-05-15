"use client";

import { BriefcaseBusiness } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { useAcceptBooking, useCancelBooking, useProviderBookings } from "@/app/hooks/useBookings";
import { formatCurrency, formatLongDate } from "@/app/lib/utils";

export default function ProviderBookingsPage() {
  const { data, isLoading } = useProviderBookings();
  const acceptMutation = useAcceptBooking();
  const cancelMutation = useCancelBooking();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
          Provider queue
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Respond to new bookings quickly</h1>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} rows={5} />
          ))}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No incoming bookings"
          description="When customers request work, the queue will appear here with accept and decline actions."
        />
      ) : (
        <div className="grid gap-4">
          {data.map((booking) => (
            <article key={booking.id} className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[#111827]">{booking.serviceTitle}</p>
                  <p className="mt-2 text-sm text-[#6b7280]">
                    {booking.customerName} • {booking.location}
                  </p>
                  <p className="mt-2 text-sm text-[#6b7280]">{formatLongDate(booking.scheduledAt)}</p>
                  <p className="mt-4 text-sm leading-6 text-[#6b7280]">{booking.notes}</p>
                </div>
                <div className="space-y-3 lg:text-right">
                  <p className="text-lg font-semibold text-[#111827]">{formatCurrency(booking.amount)}</p>
                  <span className="inline-flex rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#374151]">
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.status === "PENDING" ? (
                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                      <Button
                        size="sm"
                        onClick={() => acceptMutation.mutate(booking.id)}
                        isLoading={acceptMutation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => cancelMutation.mutate({ id: booking.id, reason: "Provider unavailable" })}
                        isLoading={cancelMutation.isPending}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : null}
                  {(booking.status === "QUOTE_REQUESTED" || booking.status === "NEGOTIATING") && booking.quotationId ? (
                    <div className="flex justify-end">
                      <Link href={`/provider/quotations/${booking.quotationId}`}>
                        <Button size="sm">
                          Review Quotation
                        </Button>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
