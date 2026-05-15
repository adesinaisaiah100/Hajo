"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CalendarClock, MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { PaymentSummary } from "@/app/components/shared/PaymentSummary";
import { useBooking, useCancelBooking, useCompleteBooking } from "@/app/hooks/useBookings";
import { formatLongDate } from "@/app/lib/utils";

export default function CustomerBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: booking } = useBooking(params.id);
  const cancelMutation = useCancelBooking();
  const completeMutation = useCompleteBooking();
  const created = searchParams.get("created") === "1";

  if (!booking) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Booking not found"
        description="The booking could not be loaded yet. Return to your bookings list and try again."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {created ? (
          <div className="rounded-3xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 text-sm text-[#166534]">
            Booking request created successfully. The provider can now review it and the wallet hold will reflect in your transaction history.
          </div>
        ) : null}

        <section className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
                Booking {booking.id.toUpperCase()}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
                {booking.serviceTitle}
              </h1>
              <p className="mt-2 text-sm text-[#6b7280]">
                {booking.providerName} • {booking.providerTrade}
              </p>
            </div>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-sm font-semibold text-[#374151]">
              {booking.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f9fafb] p-4 text-sm text-[#6b7280]">
              <p className="font-semibold text-[#111827]">Schedule</p>
              <p className="mt-2 inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {formatLongDate(booking.scheduledAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f9fafb] p-4 text-sm text-[#6b7280]">
              <p className="font-semibold text-[#111827]">Location</p>
              <p className="mt-2 inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.location}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-4">
            <p className="text-sm font-semibold text-[#111827]">Job notes</p>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">{booking.notes}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#111827]">Booking timeline</h2>
            <div className="mt-4 space-y-4">
              {booking.timeline.map((step) => (
                <div key={step.label} className="flex gap-3">
                  <div className={`mt-1 h-3.5 w-3.5 rounded-full ${step.complete ? "bg-[#14b8a6]" : "bg-[#d1d5db]"}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{step.label}</p>
                    <p className="mt-1 text-sm text-[#6b7280]">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
        <PaymentSummary amount={booking.amount} currency={booking.currency}>
          <Link href="/customer/wallet" className="text-sm font-semibold text-[#14b8a6]">
            View wallet activity
          </Link>
        </PaymentSummary>

        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[#111827]">Actions</h3>
          <div className="mt-4 flex flex-col gap-3">
            {(booking.status === "QUOTE_SENT" || booking.status === "NEGOTIATING") && booking.quotationId ? (
              <Link href={`/customer/quotations/${booking.quotationId}`}>
                <Button className="w-full">
                  Review Quotation
                </Button>
              </Link>
            ) : null}
            {booking.status === "ACCEPTED" ? (
              <Button
                onClick={() => completeMutation.mutate(booking.id)}
                isLoading={completeMutation.isPending}
              >
                Confirm completion
              </Button>
            ) : null}
            {booking.status === "PENDING" ? (
              <Button
                variant="secondary"
                onClick={() => cancelMutation.mutate({ id: booking.id, reason: "Customer cancelled" })}
                isLoading={cancelMutation.isPending}
              >
                Cancel request
              </Button>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
