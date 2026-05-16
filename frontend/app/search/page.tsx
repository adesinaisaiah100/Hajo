"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, Sparkles, Star, X } from "lucide-react";
import { useMarketplaceSearch } from "@/app/hooks/useMarketplaceSearch";
import { getMockProviders } from "@/app/lib/mock-marketplace";
import { Button } from "@/app/components/ui/Button";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";
import { formatCurrency } from "@/app/lib/utils";

type SortOption = "RELEVANCE" | "PRICE_ASC" | "RATING";

const DISTANCE_FILTERS = [1, 5, 10, 20] as const;
const RATING_FILTERS = [0, 3, 4, 4.5] as const;

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuery = params.get("q") || "";
  const initialCategory = params.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("RELEVANCE");

  const { data, isLoading, isFetching } = useMarketplaceSearch(submittedQuery);

  const providers = useMemo(() => {
    const seed = submittedQuery.trim().length > 0 ? data ?? [] : getMockProviders();
    const filtered = seed
      .filter((provider) => !category || provider.category.toLowerCase().replace(/\s+/g, "_") === category)
      .filter((provider) => (distanceKm ? provider.distanceKm <= distanceKm : true))
      .filter((provider) => provider.rating >= minRating);

    if (sortBy === "PRICE_ASC") {
      return [...filtered].sort((a, b) => a.priceFrom - b.priceFrom);
    }

    if (sortBy === "RATING") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [category, data, distanceKm, minRating, sortBy, submittedQuery]);

  const clearFilters = () => {
    setCategory("");
    setDistanceKm(null);
    setMinRating(0);
    setSortBy("RELEVANCE");
  };

  const syncUrl = (nextQuery: string, nextCategory: string) => {
    const url = new URLSearchParams();
    if (nextQuery) {
      url.set("q", nextQuery);
    }
    if (nextCategory) {
      url.set("category", nextCategory);
    }
    const suffix = url.toString();
    router.replace(suffix ? `/search?${suffix}` : "/search");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <form
          className="rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedQuery(query.trim());
            syncUrl(query.trim(), category);
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)]"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-white pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[rgba(20,184,166,0.18)]"
                placeholder="Describe what you need - e.g. fix my kitchen pipe in Yaba."
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)]"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Button type="submit" size="sm" isLoading={isFetching}>
              Search
            </Button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </span>

            <label className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
              <span className="mr-2">Category</span>
              <select
                value={category}
                onChange={(event) => {
                  const value = event.target.value;
                  setCategory(value);
                  syncUrl(submittedQuery, value);
                }}
                className="bg-transparent text-xs font-semibold text-[var(--foreground)] outline-none"
              >
                <option value="">All</option>
                <option value="barber">Barber</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="tailor">Tailor</option>
                <option value="hair_stylist">Hair Stylist</option>
                <option value="carpenter">Carpenter</option>
                <option value="cleaner">Cleaner</option>
                <option value="event_planner">Event Planner</option>
                <option value="caterer">Caterer</option>
                <option value="painter">Painter</option>
              </select>
            </label>

            {DISTANCE_FILTERS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDistanceKm(distanceKm === value ? null : value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  distanceKm === value
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)]"
                }`}
              >
                {value}km
              </button>
            ))}

            {RATING_FILTERS.map((value) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setMinRating(value)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  minRating === value
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)]"
                }`}
              >
                <Star className="h-3 w-3" />
                {value === 0 ? "Any" : `${value}+`}
              </button>
            ))}

            <label className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
              <span className="mr-2">Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="bg-transparent text-xs font-semibold text-[var(--foreground)] outline-none"
              >
                <option value="RELEVANCE">Relevance</option>
                <option value="PRICE_ASC">Price low to high</option>
                <option value="RATING">Rating</option>
              </select>
            </label>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {providers.length} artisan{providers.length === 1 ? "" : "s"} found near you
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[var(--color-brand)]"
          >
            Clear filters
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <Sparkles className="h-4 w-4 text-[var(--color-brand)]" />
              Finding the best match for your request...
            </p>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-white p-4"
              >
                <div className="animate-pulse space-y-3">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                      <div className="h-3 w-24 rounded bg-gray-200" />
                      <div className="h-3 w-32 rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="h-10 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-line)] bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-[var(--color-surface)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">No artisans found near you for this search.</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Try a wider distance or different description.
            </p>
            <Button className="mt-5" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => {
              const availableNow = provider.distanceKm <= 10;
              return (
                <article
                  key={provider.id}
                  className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-white shadow-sm"
                >
                  <div className="flex gap-4 p-4">
                    {provider.avatarUrl ? (
                      <img 
                        src={provider.avatarUrl} 
                        alt={provider.name}
                        className="h-20 w-20 flex-none rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 flex-none rounded-lg bg-[var(--color-surface)]" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)]">{provider.name}</h3>
                          <span className="mt-1 inline-flex rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-ink-muted)]">
                            {provider.category}
                          </span>
                        </div>
                        <ScoreBadge tier={provider.tier} />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-ink-muted)]">
                        <span className="font-medium text-[var(--foreground)]">⭐ {provider.rating} ({provider.reviewCount} reviews)</span>
                        <span>{formatCurrency(provider.priceFrom)} - {formatCurrency(provider.priceTo)}</span>
                        <span>{provider.distanceKm} km away</span>
                        <span className="inline-flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full ${availableNow ? "bg-[#10b981]" : "bg-gray-400"}`} />
                          {availableNow ? "Available now" : "Not available now"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <Button href={`/providers/${provider.id}`} size="sm">
                          View profile
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-line)] bg-[#f0fdfa] px-4 py-2 text-sm italic text-[#0f766e]">
                    Matches because: {provider.matchReasons[0]?.toLowerCase() || "strong fit for your request in your area"}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
