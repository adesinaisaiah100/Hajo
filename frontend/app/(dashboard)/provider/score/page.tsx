"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, TrendingUp, Star, Calendar } from "lucide-react";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { ScoreCircle } from "@/app/components/provider/ScoreCircle";
import { useAuthStore } from "@/app/store/auth.store";
import { getMockProvider } from "@/app/lib/mock-marketplace";

export default function ProviderScorePage() {
  const user = useAuthStore((state) => state.user);
  const providerId = user?.provider?.id || "prov-1";

  const { data: provider } = useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => getMockProvider(providerId),
  });

  const score = 67; // Mocked
  const tier = provider?.tier || "GOLD";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Credit Score</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Understand your score and what you can do to improve it.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#e5e7eb] bg-white p-10 text-center shadow-sm">
        <ScoreCircle score={score} tier={tier} />
        <h2 className="mt-6 text-xl font-bold text-[#111827]">
          You are a {tier} tier provider
        </h2>
        <p className="mt-2 max-w-lg text-sm text-[#6b7280]">
          Your Gold score means you're eligible for priority listing on search results. 
          Reach Platinum to unlock exclusive financial services and higher platform visibility.
        </p>
        <div className="mt-6 rounded-2xl bg-[#f0fdfa] p-4 text-left border border-[#ccfbf1] max-w-2xl">
          <p className="text-sm font-medium text-[#0f766e]">
            <strong>AI Insight:</strong> Your Silver score of 64 reflects strong earnings and consistent customer ratings. 
            Your biggest opportunity to move to Gold is completing more bookings — you need 8 more completed jobs this month. 
            Responding to booking requests within 2 hours will also improve your response time sub-score significantly.
          </p>
        </div>
      </div>

      <SectionCard title="Score Factors Breakdown">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Factor: Jobs */}
          <div className="rounded-2xl border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f3f4f6] p-2 text-[#6b7280]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Jobs Completed</h3>
                  <p className="text-xs text-[#6b7280]">{provider?.jobsCompleted} / 50 jobs</p>
                </div>
              </div>
              <span className="font-bold text-[#111827]">30/40</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: "75%" }} />
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              Need 12 more completed jobs to maximize this factor.
            </p>
          </div>

          {/* Factor: Earnings */}
          <div className="rounded-2xl border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f3f4f6] p-2 text-[#6b7280]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Total Earned</h3>
                  <p className="text-xs text-[#6b7280]">₦420,000 / ₦500,000</p>
                </div>
              </div>
              <span className="font-bold text-[#111827]">25/30</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: "84%" }} />
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              You're close to the cap! Excellent earnings history.
            </p>
          </div>

          {/* Factor: Rating */}
          <div className="rounded-2xl border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f3f4f6] p-2 text-[#6b7280]">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Customer Rating</h3>
                  <p className="text-xs text-[#6b7280]">{provider?.rating} Average</p>
                </div>
              </div>
              <span className="font-bold text-[#111827]">18/20</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: "90%" }} />
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              Based on {provider?.reviewCount} reviews. Great job!
            </p>
          </div>

          {/* Factor: Tenure */}
          <div className="rounded-2xl border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f3f4f6] p-2 text-[#6b7280]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Account Tenure</h3>
                  <p className="text-xs text-[#6b7280]">14 months</p>
                </div>
              </div>
              <span className="font-bold text-[#111827]">10/10</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: "100%" }} />
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              You've reached the maximum tenure score.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
