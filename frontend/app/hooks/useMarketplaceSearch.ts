"use client";

import { useQuery } from "@tanstack/react-query";
import { matchProviders } from "@/app/services/ai.api";

export function useMarketplaceSearch(query: string) {
  return useQuery({
    queryKey: ["marketplace-search", query],
    queryFn: () => matchProviders({ query }),
    enabled: query.trim().length > 0,
  });
}
