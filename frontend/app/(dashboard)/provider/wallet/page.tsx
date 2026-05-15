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
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
          Provider wallet
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Watch released earnings and pending payouts</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#6b7280]">Available balance</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111827]">
            {formatCurrency(data.availableBalance)}
          </p>
        </div>
        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#6b7280]">Pending balance</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111827]">
            {formatCurrency(data.pendingBalance)}
          </p>
        </div>
        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f0fdfa] p-3 text-[#0f766e]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Total released earnings</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
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
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f9fafb] px-3 py-2 text-sm text-[#6b7280]">
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
