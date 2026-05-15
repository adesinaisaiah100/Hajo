import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import type { TransactionRecord } from "@/app/lib/mock-marketplace";
import { cn, formatCurrency, formatLongDate } from "@/app/lib/utils";

function iconForType(type: TransactionRecord["type"]) {
  if (type === "WITHDRAWAL" || type === "ESCROW_CHARGE") {
    return ArrowUpRight;
  }

  if (type === "ESCROW_RELEASE" || type === "DEPOSIT" || type === "WALLET_CREDIT") {
    return ArrowDownLeft;
  }

  return Wallet;
}

export function TransactionList({ transactions }: { transactions: TransactionRecord[] }) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const Icon = iconForType(transaction.type);

        return (
          <div
            key={transaction.id}
            className="flex flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[#f9fafb] p-3 text-[#14b8a6]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{transaction.description}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{formatLongDate(transaction.createdAt)}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold text-[#111827]">{formatCurrency(transaction.amount)}</p>
              <span
                className={cn(
                  "mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  transaction.status === "SUCCESS"
                    ? "bg-[#ecfdf5] text-[#047857]"
                    : transaction.status === "FAILED"
                      ? "bg-[#fee2e2] text-[#b91c1c]"
                      : "bg-[#fef3c7] text-[#92400e]",
                )}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
