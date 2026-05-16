"use client";

import { Landmark, TrendingUp } from "lucide-react";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { TransactionList } from "@/app/components/shared/TransactionList";
import { useWallet } from "@/app/hooks/useWallet";
import { formatCurrency } from "@/app/lib/utils";

export default function ProviderWalletPage() {
  const { data, isLoading } = useWallet("provider");

  if (isLoading || !data) {
    return <SkeletonCard rows={8} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
          Provider wallet
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Watch released earnings and pending payouts</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--color-ink-muted)]">Available balance</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {formatCurrency(data.availableBalance)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--color-ink-muted)]">Pending balance</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {formatCurrency(data.pendingBalance)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[var(--color-surface)] p-3 text-[var(--color-success)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-ink-muted)]">Total released earnings</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {formatCurrency(data.totalEarnings ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionCard
        title="Payout destination"
        description="This wallet is linked to your Squad virtual account for demo funding and payout tracking."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink-muted)]">
            <Landmark className="h-4 w-4" />
            {data.virtualAccountNumber}
          </span>
        }
      >
        <TransactionList transactions={data.transactions} />
      </SectionCard>
    </div>
  );
}
