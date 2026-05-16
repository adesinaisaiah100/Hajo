import Link from "next/link";
import { CalendarClock, ChevronRight, MapPin } from "lucide-react";
import type { BookingRecord } from "@/app/lib/mock-marketplace";
import { cn, formatCurrency, formatLongDate } from "@/app/lib/utils";

const statusClasses = {
  PENDING: "bg-amber-50 text-amber-900",
  QUOTE_REQUESTED: "bg-blue-50 text-blue-900",
  QUOTE_SENT: "bg-blue-50 text-blue-900",
  NEGOTIATING: "bg-purple-50 text-purple-900",
  ACCEPTED: "bg-green-50 text-green-900",
  COMPLETED: "bg-cyan-50 text-cyan-900",
  CANCELLED: "bg-red-50 text-red-900",
};

export function BookingCard({
  booking,
  href,
}: {
  booking: BookingRecord;
  href: string;
}) {
  const isQuotationAction = booking.status === "QUOTE_SENT" || booking.status === "NEGOTIATING";
  const quotationHref = `/customer/quotations/${booking.quotationId}`;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-line)] bg-white p-5 transition duration-200 hover:shadow-card">
      <Link href={href} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{booking.serviceTitle}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              {booking.providerName} • {booking.providerTrade}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusClasses[booking.status])}>
            {booking.status === 'PENDING' ? 'Waiting for Artisan' : booking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid gap-3 text-sm text-[var(--color-ink-muted)] sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            {formatLongDate(booking.scheduledAt)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {booking.location}
          </span>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4">
        <p className="text-base font-semibold text-[var(--foreground)]">
          {formatCurrency(booking.amount, booking.currency)}
        </p>
        
        {isQuotationAction && booking.quotationId ? (
          <Link 
            href={quotationHref}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-strong)] transition-colors"
          >
            Review Quotation
            <ChevronRight className="h-3 w-3" />
          </Link>
        ) : (
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-strong)] transition-colors">
            Open details
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
