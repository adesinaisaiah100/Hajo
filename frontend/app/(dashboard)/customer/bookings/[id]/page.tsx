"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, MapPin, MessageSquareText, Star } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { useBooking, useCancelBooking, useCompleteBooking } from "@/app/hooks/useBookings";
import { cn, formatCurrency, formatLongDate } from "@/app/lib/utils";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";
import { getMockProvider } from "@/app/lib/mock-marketplace";

const TIMELINE_STEPS = ["Requested", "Accepted", "In Progress", "Completed"] as const;

export default function CustomerBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: booking } = useBooking(params.id);
  const cancelMutation = useCancelBooking();
  const completeMutation = useCompleteBooking();
  const created = searchParams.get("created") === "1";
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const provider = booking ? getMockProvider(booking.providerId) : null;

  const timelineState = useMemo(() => {
    if (!booking) {
      return TIMELINE_STEPS.map((step) => ({ step, complete: false, timestamp: "Pending" }));
    }

    const map = {
      Requested: true,
      Accepted: ["ACCEPTED", "COMPLETED"].includes(booking.status),
      "In Progress": ["ACCEPTED", "COMPLETED"].includes(booking.status),
      Completed: booking.status === "COMPLETED",
    } as Record<(typeof TIMELINE_STEPS)[number], boolean>;

    return TIMELINE_STEPS.map((step) => {
      const source = booking.timeline.find((item) => {
        const label = item.label.toLowerCase();
        if (step === "Requested") return label.includes("requested");
        if (step === "Accepted") return label.includes("accepted") || label.includes("confirmation");
        if (step === "In Progress") return label.includes("waiting") || label.includes("progress");
        return label.includes("release") || label.includes("completed");
      });

      return {
        step,
        complete: map[step],
        timestamp: source?.timestamp === "Pending" || !source?.timestamp ? "Pending" : formatLongDate(source.timestamp),
      };
    });
  }, [booking]);

  if (!booking) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Booking not found"
        description="The booking could not be loaded yet. Return to your bookings list and try again."
      />
    );
  }

  const canShowQuotation = Boolean(booking.quotationId);
  const isActive = ["ACCEPTED", "QUOTE_REQUESTED", "QUOTE_SENT", "NEGOTIATING"].includes(booking.status);
  const isCancelled = booking.status === "CANCELLED";
  const canReview = booking.status === "COMPLETED" && !reviewSubmitted;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {created ? (
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-success)]">
            Booking request created successfully. The provider can now review it and the wallet hold will reflect in your transaction history.
          </div>
        ) : null}

        <section className="rounded-lg border border-[var(--color-line)] bg-white p-4 shadow-sm">
          <a
            href={`/providers/${booking.providerId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3"
          >
            <div className="h-14 w-14 rounded-lg bg-[var(--color-surface)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-[var(--foreground)]">{booking.providerName}</p>
              <p className="text-sm text-[var(--color-ink-muted)]">{booking.providerTrade}</p>
            </div>
            {provider ? <ScoreBadge tier={provider.tier} /> : null}
          </a>
        </section>

        <section className="rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {booking.serviceTitle}
              </h1>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                {booking.providerName} • {booking.providerTrade}
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-sm font-semibold text-[var(--color-ink-muted)]">
              {booking.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink-muted)]">
              <p className="font-semibold text-[var(--foreground)]">Schedule</p>
              <p className="mt-2 inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {formatLongDate(booking.scheduledAt)}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink-muted)]">
              <p className="font-semibold text-[var(--foreground)]">Location</p>
              <p className="mt-2 inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.location}
              </p>
            </div>

            <div className="rounded-lg bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink-muted)]">
              <p className="font-semibold text-[var(--foreground)]">Amount paid</p>
              <p className="mt-2 text-base font-bold text-[var(--foreground)]">{formatCurrency(booking.amount, booking.currency)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[var(--color-line)] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Customer description</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">{booking.notes}</p>
          </div>

          <div className="mt-6 rounded-lg border border-[#fcd34d] bg-[#fffbeb] p-4 text-sm text-[#92400e]">
            <p className="font-semibold">{formatCurrency(booking.amount, booking.currency)} is held securely in escrow.</p>
            <p className="mt-1">
              It will release to the artisan only when you confirm the job is complete.
            </p>
          </div>

          {canShowQuotation ? (
            <details className="mt-6 rounded-lg border border-[var(--color-line)] bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground)]">View Quotation</summary>
              <div className="mt-4 grid gap-2 text-sm text-[var(--color-ink-muted)]">
                <div className="flex items-center justify-between rounded bg-[var(--color-surface)] px-3 py-2">
                  <span>Labour</span>
                  <span className="font-semibold text-[var(--foreground)]">{formatCurrency(Math.floor(booking.amount * 0.6))}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[var(--color-surface)] px-3 py-2">
                  <span>Materials</span>
                  <span className="font-semibold text-[var(--foreground)]">{formatCurrency(Math.floor(booking.amount * 0.3))}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[var(--color-surface)] px-3 py-2">
                  <span>Platform fee</span>
                  <span className="font-semibold text-[var(--foreground)]">{formatCurrency(Math.floor(booking.amount * 0.1))}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-2">
                  <span className="font-semibold text-[var(--foreground)]">Total</span>
                  <span className="font-semibold text-[var(--foreground)]">{formatCurrency(booking.amount)}</span>
                </div>
              </div>
            </details>
          ) : null}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Status timeline</h2>
            <div className="mt-4 space-y-4">
              {timelineState.map((step, index) => (
                <div key={step.step} className="flex gap-3">
                  <div className="relative mt-1 flex flex-col items-center">
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2",
                        step.complete ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white" : "border-[var(--color-line)] bg-white text-transparent",
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {index < timelineState.length - 1 ? (
                      <span className="mt-1 h-8 w-px bg-[var(--color-line)]" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{step.step}</p>
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--foreground)]">Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {isActive ? (
              <Button onClick={() => completeMutation.mutate(booking.id)} isLoading={completeMutation.isPending}>
                Mark as Complete
              </Button>
            ) : null}

            {canShowQuotation ? (
              <Button variant="secondary" href={`/customer/bookings/${booking.id}/quotation`}>
                View Quotation
              </Button>
            ) : null}

            {isActive ? (
              <Button
                variant="secondary"
                className="border-[#ef4444] text-[#b91c1c] hover:border-[#b91c1c]"
              >
                <MessageSquareText className="h-4 w-4" />
                Raise Dispute
              </Button>
            ) : null}

            {canReview ? (
              <Button onClick={() => setShowReviewModal(true)}>Leave a Review</Button>
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

          {isCancelled ? (
            <p className="mt-4 rounded-lg bg-[var(--color-surface)] p-3 text-sm text-[var(--color-ink-muted)]">
              This booking was cancelled. Your refund has been returned to your wallet.
            </p>
          ) : null}

          {reviewSubmitted ? (
            <p className="mt-4 rounded-lg bg-[#ecfdf5] p-3 text-sm text-[#047857]">
              Your review has been submitted.
            </p>
          ) : null}
        </section>
      </div>

      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Leave a Review</h3>
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded p-1"
                    aria-label={`Rate ${value}`}
                  >
                    <Star className={cn("h-6 w-6", value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                  </button>
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder="Share your experience (optional)"
              className="mt-4 w-full rounded-lg border border-[var(--color-line)] p-3 text-sm outline-none focus:border-[var(--color-brand)]"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setReviewSubmitted(true);
                  setShowReviewModal(false);
                }}
                disabled={rating === 0}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
