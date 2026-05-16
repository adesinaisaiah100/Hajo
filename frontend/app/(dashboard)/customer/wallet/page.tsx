"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Copy, Wallet2 } from "lucide-react";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { useWallet } from "@/app/hooks/useWallet";
import { useCustomerBookings } from "@/app/hooks/useBookings";
import { formatCurrency, formatLongDate } from "@/app/lib/utils";
import { toast } from "@/app/store/toast.store";

type DateFilter = "TODAY" | "WEEK" | "MONTH" | "THREE_MONTHS";

const DATE_FILTERS: Array<{ value: DateFilter; label: string }> = [
  { value: "TODAY", label: "Today" },
  { value: "WEEK", label: "This week" },
  { value: "MONTH", label: "This month" },
  { value: "THREE_MONTHS", label: "Last 3 months" },
];

export default function CustomerWalletPage() {
  const { data, isLoading } = useWallet("customer");
  const { data: bookings } = useCustomerBookings();
  const [showFundDetails, setShowFundDetails] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("MONTH");
  const historyRef = useRef<HTMLDivElement | null>(null);

  if (isLoading || !data) {
    return <SkeletonCard rows={8} />;
  }

  const activeEscrowBooking = (bookings || []).find((booking) => ["ACCEPTED", "QUOTE_SENT", "NEGOTIATING", "PENDING"].includes(booking.status));

  const days = dateFilter === "TODAY" ? 1 : dateFilter === "WEEK" ? 7 : dateFilter === "MONTH" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - days);
  const filteredTransactions = data.transactions.filter(
    (transaction) => new Date(transaction.createdAt).getTime() >= cutoff.getTime(),
  );

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(data.virtualAccountNumber);
    toast.success("Copied", "Account number copied to clipboard.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--color-line)] bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-[var(--color-ink-muted)]">Available to spend</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--foreground)]">
          {formatCurrency(data.availableBalance, "NGN")}.00
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowFundDetails((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Fund Wallet
          </button>
          <button
            type="button"
            onClick={() => historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]"
          >
            Transaction History
          </button>
        </div>
      </section>

      {showFundDetails ? (
        <section className="rounded-xl border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Fund your Hajo wallet</h2>

          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
              <span className="text-[var(--color-ink-muted)]">Account Number</span>
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--foreground)]">
                {data.virtualAccountNumber}
                <button type="button" onClick={copyAccountNumber} className="rounded p-1 hover:bg-white" aria-label="Copy account number">
                  <Copy className="h-4 w-4" />
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
              <span className="text-[var(--color-ink-muted)]">Bank Name</span>
              <span className="font-semibold text-[var(--foreground)]">Wema Bank</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
              <span className="text-[var(--color-ink-muted)]">Account Name</span>
              <span className="font-semibold text-[var(--foreground)]">{data.virtualAccountName} - Hajo</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
            Transfer any amount from any Nigerian bank. Funds reflect instantly.
          </p>

          <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">How to fund your wallet</h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-xs">
                <div className="flex-none w-6 h-6 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center font-bold">1</div>
                <p className="text-[var(--color-ink-muted)]">Open your bank app and select "Transfer to Bank Account"</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex-none w-6 h-6 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center font-bold">2</div>
                <p className="text-[var(--color-ink-muted)]">Enter the account details shown above</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex-none w-6 h-6 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center font-bold">3</div>
                <p className="text-[var(--color-ink-muted)]">Confirm the recipient is "{data.virtualAccountName} - Hajo"</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.pendingBalance > 0 && activeEscrowBooking ? (
        <Link
          href={`/customer/bookings/${activeEscrowBooking.id}`}
          className="flex items-center justify-between rounded-lg border border-[#fcd34d] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]"
        >
          <span>
            {formatCurrency(data.pendingBalance)} held in escrow for 1 active booking.
          </span>
          <span className="font-semibold">View</span>
        </Link>
      ) : null}

      <section ref={historyRef} className="space-y-4 rounded-xl border border-[var(--color-line)] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
            <Wallet2 className="h-4 w-4" />
            Transaction history
          </h2>

          <div className="flex gap-2 overflow-x-auto">
            {DATE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setDateFilter(filter.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  dateFilter === filter.value
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-line)] px-4 py-8 text-center text-sm text-[var(--color-ink-muted)]">
            Your transactions will appear here once you make your first payment.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const isCredit = ["DEPOSIT", "WALLET_CREDIT", "ESCROW_RELEASE", "REFUND"].includes(transaction.type);
              return (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--color-line)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2.5 ${isCredit ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                      {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{transaction.description}</p>
                      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{formatLongDate(transaction.createdAt)}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className={`text-sm font-semibold ${isCredit ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {isCredit ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      transaction.status === "SUCCESS"
                        ? "bg-[#ecfdf5] text-[#047857]"
                        : transaction.status === "PENDING"
                          ? "bg-[#fffbeb] text-[#92400e]"
                          : "bg-[#fef2f2] text-[#b91c1c]"
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
