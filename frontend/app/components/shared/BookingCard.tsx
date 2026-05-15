import Link from "next/link";
import { CalendarClock, ChevronRight, MapPin } from "lucide-react";
import type { BookingRecord } from "@/app/lib/mock-marketplace";
import { cn, formatCurrency, formatLongDate } from "@/app/lib/utils";

const statusClasses = {
  PENDING: "bg-[#fef3c7] text-[#92400e]",
  QUOTE_REQUESTED: "bg-[#e0f2fe] text-[#0369a1]",
  QUOTE_SENT: "bg-[#f0f9ff] text-[#075985]",
  NEGOTIATING: "bg-[#fae8ff] text-[#86198f]",
  ACCEPTED: "bg-[#ecfdf5] text-[#047857]",
  COMPLETED: "bg-[#ecfeff] text-[#155e75]",
  CANCELLED: "bg-[#fee2e2] text-[#b91c1c]",
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
    <div className="flex flex-col gap-4 rounded-3xl border border-[#e5e7eb] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(17,24,39,0.1)]">
      <Link href={href} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#111827]">{booking.serviceTitle}</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              {booking.providerName} • {booking.providerTrade}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusClasses[booking.status])}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid gap-3 text-sm text-[#6b7280] sm:grid-cols-2">
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

      <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-4">
        <p className="text-base font-semibold text-[#111827]">
          {formatCurrency(booking.amount, booking.currency)}
        </p>
        
        {isQuotationAction && booking.quotationId ? (
          <Link 
            href={quotationHref}
            className="inline-flex items-center gap-2 rounded-full bg-[#14b8a6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0d9488]"
          >
            Review Quotation
            <ChevronRight className="h-3 w-3" />
          </Link>
        ) : (
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#14b8a6]">
            Open details
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
