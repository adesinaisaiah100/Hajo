import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { ProviderProfile } from "@/app/lib/mock-marketplace";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";

export function ProviderCard({ provider }: { provider: ProviderProfile }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(17,24,39,0.1)]">
      <div className="flex h-[120px] items-end justify-between border-b border-[#f3f4f6] bg-[#f9fafb] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
            {provider.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[#111827]">{provider.name}</h3>
        </div>
        {provider.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#047857]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-[#6b7280]">{provider.tradeName}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {provider.area}, {provider.city}
          </span>
          <span>{provider.distanceKm}km away</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[#111827]">
            <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
            {provider.rating} ({provider.reviewCount})
          </span>
          <ScoreBadge tier={provider.tier} />
        </div>

        <ul className="space-y-2 text-sm text-[#6b7280]">
          {provider.matchReasons.slice(0, 2).map((reason) => (
            <li key={reason} className="rounded-2xl bg-[#f9fafb] px-3 py-2">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-[#f3f4f6] bg-[#f9fafb] px-5 py-4">
        <p className="text-sm font-semibold text-[#111827]">
          {formatCurrency(provider.priceFrom)} - {formatCurrency(provider.priceTo)}
        </p>
        <div className="flex items-center gap-2">
          <Button href={`/providers/${provider.id}`} variant="ghost" size="sm">
            View profile
          </Button>
          <Button href={`/customer/providers/${provider.id}/book`} size="sm">
            Book now
          </Button>
        </div>
      </div>
    </article>
  );
}
