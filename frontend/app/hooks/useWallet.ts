"use client";

import { useQuery } from "@tanstack/react-query";
import { getWalletSnapshot } from "@/app/services/wallet.api";

export function useWallet(role: "customer" | "provider") {
  return useQuery({
    queryKey: ["wallet", role],
    queryFn: () => getWalletSnapshot(role),
  });
}
