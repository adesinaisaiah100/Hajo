import type { ReactNode } from "react";
import { formatCurrency } from "@/app/lib/utils";

export function PaymentSummary({
  amount,
  currency = "NGN",
  children,
}: {
  amount: number;
  currency?: string;
  children?: ReactNode;
}) {
  const fee = 0;
  const total = amount + fee;

  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-5">
      <h3 className="text-base font-semibold text-[#111827]">Payment summary</h3>
      <div className="mt-4 space-y-3 text-sm text-[#6b7280]">
        <div className="flex items-center justify-between">
          <span>Service amount</span>
          <span className="font-medium text-[#111827]">{formatCurrency(amount, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Platform fee</span>
          <span className="font-medium text-[#111827]">{formatCurrency(fee, currency)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-3 text-base font-semibold text-[#111827]">
          <span>Total held in escrow</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
