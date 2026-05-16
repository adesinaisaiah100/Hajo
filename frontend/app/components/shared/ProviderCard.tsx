import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { ProviderProfile } from "@/app/lib/mock-marketplace";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";

export function ProviderCard({ provider }: { provider: ProviderProfile }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[var(--color-line)] bg-white transition-all duration-200 hover:shadow-card hover:border-[var(--color-brand)]/30">
      {/* Image/Hero Section */}
      <div className="relative h-40 bg-[var(--color-surface)] flex items-center justify-center overflow-hidden">
        {/* Image placeholder/Hero Image */}
        {provider.heroImageUrl ? (
          <img 
            src={provider.heroImageUrl} 
            alt={provider.tradeName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-ink-muted)]/20">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Verification badge */}
        {provider.verified ? (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-accent)]">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="space-y-4 p-6">
        {/* Category & Name */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand)] mb-1.5">
            {provider.category}
          </p>
          <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight">
            {provider.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] line-clamp-2">
          {provider.tradeName}
        </p>

        {/* Location & Rating Row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-muted)]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[var(--color-brand)]" />
            <span>{provider.area}, {provider.city}</span>
          </span>
          <span className="text-[var(--color-line)]">•</span>
          <span>{provider.distanceKm}km away</span>
        </div>

        {/* Rating & Tier */}
        <div className="flex items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--foreground)]">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {provider.rating}
          </span>
          <span className="text-xs text-[var(--color-ink-muted)]">({provider.reviewCount} reviews)</span>
          <div className="ml-auto">
            <ScoreBadge tier={provider.tier} />
          </div>
        </div>

        {/* Why matched - refined pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {provider.matchReasons.slice(0, 2).map((reason) => (
            <span key={reason} className="inline-block rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-brand)] border border-[var(--color-line)]">
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action Section */}
      <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] mb-0.5">
            Price range
          </p>
          <p className="font-semibold text-[var(--foreground)] text-base">
            {formatCurrency(provider.priceFrom)} – {formatCurrency(provider.priceTo)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button href={`/providers/${provider.id}`} variant="ghost" size="sm">
            Profile
          </Button>
          <Button href={`/customer/providers/${provider.id}/book`} size="sm">
            Book
          </Button>
        </div>
      </div>
    </article>
  );
}
