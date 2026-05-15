"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { ProviderCard } from "@/app/components/shared/ProviderCard";
import { SkeletonCard } from "@/app/components/shared/SkeletonCard";
import { useMarketplaceSearch } from "@/app/hooks/useMarketplaceSearch";
import { getMockProviders } from "@/app/lib/mock-marketplace";
import { Button } from "@/app/components/ui/Button";

export default function SearchPage() {
  const [query, setQuery] = useState("electrician in Yaba for urgent home repair");
  const [submittedQuery, setSubmittedQuery] = useState(query);
  const { data, isLoading, isFetching } = useMarketplaceSearch(submittedQuery);
  const providers = submittedQuery.trim().length > 0 ? data ?? [] : getMockProviders();

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-[#e5e7eb] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#f0fdfa] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">
                <Sparkles className="h-3.5 w-3.5" />
                AI provider search
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
                Find the right provider without digging through dozens of profiles.
              </h1>
              <p className="text-base leading-7 text-[#6b7280]">
                Search with plain language, review match reasons, and move into escrow-backed booking in one flow.
              </p>
            </div>
            <Button href="/customer/bookings" variant="secondary">
              View my bookings
            </Button>
          </div>

          <form
            className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedQuery(query);
            }}
          >
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-2xl border border-[#d1d5db] bg-white pl-11 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#14b8a6] focus:ring-2 focus:ring-[rgba(20,184,166,0.18)]"
                placeholder="Try: plumber in Lekki for kitchen leak this afternoon"
              />
            </label>
            <Button type="submit" size="lg" isLoading={isFetching}>
              Match providers
            </Button>
          </form>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Search results</h2>
                <p className="text-sm text-[#6b7280]">
                  {providers.length} provider{providers.length === 1 ? "" : "s"} matched your request
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} rows={6} />)
                : providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-[#111827]">How matching works</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6b7280]">
                <li>Search considers trade, location, response speed, and customer feedback.</li>
                <li>Verified providers with stronger completion history appear higher.</li>
                <li>Use the profile page to compare pricing, services, and reviews before booking.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
