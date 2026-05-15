"use client";

import { Landmark, Wallet2 } from "lucide-react";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { TransactionList } from "@/app/components/shared/TransactionList";
import { useWallet } from "@/app/hooks/useWallet";
import { formatCurrency } from "@/app/lib/utils";

export default function CustomerWalletPage() {
  const { data, isLoading } = useWallet("customer");

  if (isLoading || !data) {
    return <SkeletonCard rows={8} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
          Customer wallet
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Manage funding and escrow holds</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-sm text-[#6b7280]">Available balance</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#111827]">
            {formatCurrency(data.availableBalance)}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f9fafb] p-4">
              <p className="text-sm text-[#6b7280]">Pending in escrow</p>
              <p className="mt-2 text-xl font-semibold text-[#111827]">
                {formatCurrency(data.pendingBalance)}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f9fafb] p-4">
              <p className="text-sm text-[#6b7280]">Virtual account</p>
              <p className="mt-2 text-xl font-semibold text-[#111827]">{data.virtualAccountNumber}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f0fdfa] p-3 text-[#0f766e]">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">{data.virtualAccountName}</p>
              <p className="text-sm text-[#6b7280]">Use this account to fund your wallet</p>
            </div>
          </div>
        </div>
      </div>

      <SectionCard
        title="Recent transactions"
        description="Wallet funding, escrow holds, and refunds will appear here."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f9fafb] px-3 py-2 text-sm text-[#6b7280]">
            <Wallet2 className="h-4 w-4" />
            Live wallet view
          </span>
        }
      >
        <TransactionList transactions={data.transactions} />
      </SectionCard>
    </div>
  );
}
