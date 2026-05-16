"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function CustomerBookingPaymentConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">
        <CheckCircle2 className="h-4 w-4" />
        Payment confirmation
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Confirm booking payment</h1>
      <p className="text-sm text-[var(--color-ink-muted)]">
        This payment will be held in escrow and released only after you mark the job complete.
      </p>

      <div className="space-y-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-ink-muted)]">Wallet balance</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--foreground)]">
            <Wallet className="h-4 w-4" />
            N12,400.00
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-ink-muted)]">Escrow protection</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[#92400e]">
            <ShieldCheck className="h-4 w-4" />
            Enabled
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/customer/bookings" className="min-w-40">
          Confirm and continue
        </Button>
        <Link href="/customer/wallet">
          <Button variant="secondary">Fund wallet</Button>
        </Link>
      </div>
    </div>
  );
}
