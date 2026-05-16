import {
  getMockProvider,
  providerDirectory,
  type ProviderProfile,
  type ProviderReview,
} from "@/app/lib/mock-marketplace";
import { api } from "./api";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function searchProviders(query: string, city?: string): Promise<ProviderProfile[]> {
  try {
    const response = await api.post("/ai/match", { query, city });
    const data = response.data?.data;
    
    if (data && Array.isArray(data)) {
      return data.map((p: ProviderProfile) => ({
        id: p.id,
        name: `${p.user.firstName} ${p.user.lastName}`,
        tradeName: p.tradeName,
        category: p.category,
        bio: p.bio,
        rating: p.averageRating,
        reviewCount: p.reviews?.length || 0,
        distance: "Nearby", // In real app, calculate based on user location
        priceFrom: p.priceFrom,
        priceTo: p.priceTo,
        isAvailable: true,
        verificationTier: p.user.verificationTier,
        matchReason: p.matchReason,
        reviews: [],
        avatarUrl: p.user.avatarUrl,
      }));
    }
  } catch (error) {
    console.error('[Marketplace API] Search failed, falling back to local:', error);
  }

  // Fallback to local search if API fails
  const normalized = query.toLowerCase();
  return providerDirectory.filter(
    (p) =>
      p.tradeName.toLowerCase().includes(normalized) ||
      p.category.toLowerCase().includes(normalized) ||
      p.bio.toLowerCase().includes(normalized)
  );
}

export async function getProviderProfile(id: string): Promise<ProviderProfile> {
  if (apiBase) {
    try {
      const response = await fetch(`${apiBase}/api/providers/${id}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const payload = await response.json();
        return payload.provider ?? payload.data ?? payload;
      }
    } catch {
      // Fall back to seeded marketplace data until the public profile API is ready.
    }
  }

  return getMockProvider(id);
}

export async function getProviderReviews(id: string): Promise<ProviderReview[]> {
  if (apiBase) {
    try {
      const response = await fetch(`${apiBase}/api/reviews/providers/${id}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const payload = await response.json();
        return (payload.reviews ?? []).map((review: Record<string, unknown>) => ({
          id: String(review.id ?? crypto.randomUUID()),
          reviewerName:
            review.reviewer && typeof review.reviewer === "object"
              ? `${String((review.reviewer as { firstName?: string }).firstName ?? "")} ${String(
                  (review.reviewer as { lastName?: string }).lastName ?? "",
                )}`.trim()
              : "Verified customer",
          rating: Number(review.rating ?? 0),
          comment: String(review.comment ?? ""),
          createdAt: String(review.createdAt ?? new Date().toISOString()),
        }));
      }
    } catch {
      // Fall back to local reviews.
    }
  }

  return getMockProvider(id).reviews;
}
