"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, CheckCircle2, Users, CreditCard } from "lucide-react";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { EarningsChart } from "@/app/components/provider/EarningsChart";
import { useAuthStore } from "@/app/store/auth.store";
import { getMockProvider, getMockWallet } from "@/app/lib/mock-marketplace";

export default function ProviderAnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const providerId = user?.provider?.id || "prov-1";

  const { data: provider } = useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => getMockProvider(providerId),
  });

  const wallet = getMockWallet("provider");

  // Mock data for analytics
  const revenueData = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 150000 },
    { month: "Mar", amount: 180000 },
    { month: "Apr", amount: 140000 },
    { month: "May", amount: 200000 },
    { month: "Jun", amount: 248000 },
  ];

  const jobsData = [
    { month: "Jan", amount: 8 },
    { month: "Feb", amount: 12 },
    { month: "Mar", amount: 15 },
    { month: "Apr", amount: 10 },
    { month: "May", amount: 18 },
    { month: "Jun", amount: 23 },
  ];

  const topServices = [
    { title: "Home fault diagnosis", revenue: 450000, percentage: 60 },
    { title: "Apartment rewiring", revenue: 300000, percentage: 40 },
  ];

  const geographies = [
    { location: "Yaba", customers: 45 },
    { location: "Surulere", customers: 28 },
    { location: "Lekki", customers: 13 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Monitor your earnings, jobs, and performance metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">96%</p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Repeat Customers</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">42%</p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Job Value</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">₦24,500</p>
        </div>
        <div className="rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Response Time</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">15m</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <SectionCard title="Revenue Overview">
          <div className="mb-4">
            <span className="text-3xl font-bold text-[var(--foreground)]">
              ₦{wallet.totalEarnings?.toLocaleString() || 0}
            </span>
            <span className="ml-2 text-sm text-[var(--color-success)]">All time</span>
          </div>
          <EarningsChart data={revenueData} />
        </SectionCard>

        {/* Jobs Chart */}
        <SectionCard title="Jobs Overview">
          <div className="mb-4">
            <span className="text-3xl font-bold text-[var(--foreground)]">
              {provider?.jobsCompleted || 0}
            </span>
            <span className="ml-2 text-sm text-[var(--color-success)]">Total completed</span>
          </div>
          <EarningsChart data={jobsData} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Services */}
        <SectionCard title="Top Services by Revenue">
          <div className="space-y-5">
            {topServices.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-medium text-[var(--foreground)]">
                  <span>{service.title}</span>
                  <span>₦{service.revenue.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-brand)]"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Customer Geography */}
        <SectionCard title="Customer Geography">
          <div className="space-y-4">
            {geographies.map((geo, index) => (
              <div key={index} className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 last:border-0 last:pb-0">
                <span className="font-medium text-[var(--foreground)]">
                  {index + 1}. {geo.location}
                </span>
                <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-sm font-medium text-[var(--color-ink-muted)]">
                  {geo.customers} customers
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
