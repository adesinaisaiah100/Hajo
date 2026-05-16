import Link from "next/link";
import { Clock3, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { PaymentSummary } from "@/app/components/shared/PaymentSummary";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";
import { formatCurrency, formatShortDate } from "@/app/lib/utils";
import { getProviderProfile, getProviderReviews } from "@/app/services/marketplace.api";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderProfile(id);
  const reviews = await getProviderReviews(id);

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-white shadow-sm">
            {/* Hero Image Section */}
            <div className="relative h-48 w-full bg-gray-200 sm:h-64">
              {provider.heroImageUrl ? (
                <img 
                  src={provider.heroImageUrl} 
                  alt={provider.tradeName} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#14b8a6]/20 to-[#0ea5e9]/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              {/* Profile Avatar */}
              <div className="absolute -top-12 left-6 sm:left-8">
                {provider.avatarUrl ? (
                  <img 
                    src={provider.avatarUrl} 
                    alt={provider.name} 
                    className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl border-4 border-white bg-gray-100 shadow-lg" />
                )}
              </div>

              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
                      {provider.category}
                    </p>
                    <ScoreBadge tier={provider.tier} />
                    {provider.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#047857]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified provider
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
                      {provider.name}
                    </h1>
                    <p className="mt-2 text-lg text-[#6b7280]">{provider.tradeName}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {provider.area}, {provider.city}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {provider.responseTime}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                      {provider.rating} ({provider.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-5 text-sm text-[#6b7280]">
                  <p className="font-semibold text-[#111827]">From {formatCurrency(provider.priceFrom)}</p>
                  <p className="mt-1">Typical range up to {formatCurrency(provider.priceTo)}</p>
                  <p className="mt-3">Member since {formatShortDate(provider.memberSince)}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827]">About this provider</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6b7280]">{provider.bio}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {provider.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-[#f3f4f6] px-3 py-1 text-sm text-[#4b5563]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-5">
                  <h3 className="text-base font-semibold text-[#111827]">Match highlights</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6b7280]">
                    {provider.matchReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#111827]">Services</h2>
              <Link href="/search" className="text-sm font-semibold text-[#14b8a6]">
                Back to search
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {provider.services.map((service) => (
                <div key={service.id} className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-5">
                  <p className="text-base font-semibold text-[#111827]">{service.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">{service.description}</p>
                  <p className="mt-4 text-sm font-semibold text-[#111827]">
                    {formatCurrency(service.price, service.currency)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111827]">Customer reviews</h2>
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-[#111827]">{review.reviewerName}</p>
                    <span className="text-sm text-[#6b7280]">{formatShortDate(review.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#111827]">{review.rating}/5 rating</p>
                  <p className="mt-3 text-sm leading-6 text-[#6b7280]">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
          <PaymentSummary amount={provider.priceFrom}>
            <Button href={`/customer/providers/${provider.id}/book`} className="w-full">
              Book this provider
            </Button>
          </PaymentSummary>
          <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-[#111827]">Languages</h3>
            <p className="mt-3 text-sm text-[#6b7280]">{provider.languages.join(", ")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
