"use client";

import { useState } from "react";
import { TrendingUp, MapPin, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function ProviderInsightsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const insights = [
    {
      id: 1,
      title: "Saturdays are your peak day",
      description: "72% of your completed bookings happen on Saturdays. You could earn more by raising prices 15–20% on Saturdays or blocking slots for premium bookings.",
      action: "Adjust your availability or pricing for weekends",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Ikeja customers book you most",
      description: "6 of your last 10 customers are from Ikeja LGA. You may be underrepresented there — consider listing Ikeja as a service area explicitly in your bio.",
      action: "Update your bio to mention Ikeja coverage",
      icon: MapPin,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      id: 3,
      title: "Apartment rewiring is highly profitable",
      description: "This service accounts for 40% of your revenue but only 15% of your jobs. Highlighting this service with more details could attract higher-value clients.",
      action: "Review your service description",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Business Insights</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Personalized tips to grow your business based on your performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-ink-muted)]">Last refreshed: 2 hours ago</span>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="flex flex-col justify-between rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-[var(--color-surface)] p-3 text-[var(--color-brand)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{insight.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {insight.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--color-line)]">
                <button className="text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-strong)] transition-colors group flex items-center gap-1">
                  {insight.action}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-[var(--color-surface)] p-6 text-center border border-[var(--color-line)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">How does this work?</h3>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)] max-w-2xl mx-auto">
          Hajo uses secure AI to analyze your booking history, customer reviews, and market trends to generate these insights. They update automatically every 24 hours to help you optimize your earnings.
        </p>
      </div>
    </div>
  );
}
