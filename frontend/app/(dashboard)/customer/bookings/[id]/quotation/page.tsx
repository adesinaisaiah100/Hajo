"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { useBooking } from "@/app/hooks/useBookings";
import { Button } from "@/app/components/ui/Button";

export default function CustomerBookingQuotationRoutePage() {
  const params = useParams<{ id: string }>();
  const { data: booking } = useBooking(params.id);

  if (!booking) {
    return (
      <EmptyState
        icon={FileText}
        title="Booking not found"
        description="We could not load this booking right now."
      />
    );
  }

  if (!booking.quotationId) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotation yet"
        description="The artisan has not sent a quotation for this booking yet."
      />
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Booking quotation</h1>
      <p className="text-sm text-[var(--color-ink-muted)]">
        Review and negotiate the quotation details for this booking.
      </p>
      <Link href={`/customer/quotations/${booking.quotationId}`}>
        <Button>Open quotation</Button>
      </Link>
    </div>
  );
}
