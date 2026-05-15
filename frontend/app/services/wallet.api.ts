import {
  getMockWallet,
  type TransactionRecord,
  type WalletSnapshot,
} from "@/app/lib/mock-marketplace";
import { api } from "@/app/services/api";
import { useAuthStore } from "@/app/store/auth.store";

function mapTransactions(rows: Array<Record<string, unknown>>): TransactionRecord[] {
  return rows.map((item) => ({
    id: String(item.id ?? crypto.randomUUID()),
    type: String(item.type ?? "DEPOSIT") as TransactionRecord["type"],
    amount: Number(item.amount ?? 0),
    status: String(item.status ?? "PENDING") as TransactionRecord["status"],
    createdAt: String(item.createdAt ?? new Date().toISOString()),
    description: String(item.squadEvent ?? item.type ?? "Wallet activity"),
  }));
}

export async function getWalletSnapshot(role: "customer" | "provider"): Promise<WalletSnapshot> {
  const user = useAuthStore.getState().user;
  
  try {
    const response = await api.get("/transactions/summary");
    const summary = response.data?.summary;

    if (summary) {
      const transactions = mapTransactions(summary.transactions ?? []);

      return {
        ...getMockWallet(role),
        virtualAccountNumber: user?.squadAccountNo ?? getMockWallet(role).virtualAccountNumber,
        transactions,
        totalEarnings:
          role === "provider" ? Number(summary.totalEarnings ?? getMockWallet(role).totalEarnings ?? 0) : undefined,
      };
    }
  } catch {
    // Continue with local wallet seed data while the full wallet API is pending.
  }

  const wallet = getMockWallet(role);
  return {
    ...wallet,
    virtualAccountNumber: user?.squadAccountNo ?? wallet.virtualAccountNumber,
  };
}
