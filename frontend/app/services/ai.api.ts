import { api } from "@/app/services/api";
import { searchMockProviders, type ProviderProfile } from "@/app/lib/mock-marketplace";

export async function matchProviders(payload: {
  query: string;
  city?: string;
}): Promise<ProviderProfile[]> {
  try {
    const response = await api.post("/ai/match", payload);
    return response.data?.data ?? response.data?.providers ?? [];
  } catch {
    return searchMockProviders(payload.query);
  }
}
