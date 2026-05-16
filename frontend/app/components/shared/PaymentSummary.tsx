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
    <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      <h3 className="text-base font-semibold text-[var(--foreground)]">Payment summary</h3>
      <div className="mt-4 space-y-3 text-sm text-[var(--color-ink-muted)]">
        <div className="flex items-center justify-between">
          <span>Service amount</span>
          <span className="font-medium text-[var(--foreground)]">{formatCurrency(amount, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Platform fee</span>
          <span className="font-medium text-[var(--foreground)]">{formatCurrency(fee, currency)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3 text-base font-semibold text-[var(--foreground)]">
          <span>Total held in escrow</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
