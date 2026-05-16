"use client";

import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
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
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
          Provider queue
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Respond to new bookings quickly</h1>
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
            <article key={booking.id} className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{booking.serviceTitle}</p>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    {booking.customerName} • {booking.location}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{formatLongDate(booking.scheduledAt)}</p>
                  <p className="mt-4 text-sm leading-6 text-[var(--color-ink-muted)]">{booking.notes}</p>
                </div>
                <div className="space-y-3 lg:text-right">
                  <p className="text-lg font-semibold text-[var(--foreground)]">{formatCurrency(booking.amount)}</p>
                  <span className="inline-flex rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-muted)]">
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.status === "PENDING" ? (
                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                      <Button
                        size="sm"
                        onClick={() => acceptMutation.mutate(booking.id)}
                        isLoading={acceptMutation.isPending}
                      >
                        Accept {formatCurrency(booking.amount)}
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
