"use client";

import { useState } from "react";
import { Lightbulb, TrendingUp, MapPin, Clock, RefreshCw } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-[#111827]">AI Business Insights</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Personalized tips to grow your business based on your performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6b7280]">Last refreshed: 2 hours ago</span>
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
            <div key={insight.id} className="flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className={`mb-4 inline-flex rounded-full p-3 ${insight.bg} ${insight.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{insight.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                  {insight.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f3f4f6]">
                <button className="text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors group flex items-center gap-1">
                  {insight.action}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-[#f9fafb] p-6 text-center border border-[#e5e7eb]">
        <h3 className="text-sm font-semibold text-[#111827]">How does this work?</h3>
        <p className="mt-1 text-sm text-[#6b7280] max-w-2xl mx-auto">
          Hajo uses secure AI to analyze your booking history, customer reviews, and market trends to generate these insights. They update automatically every 24 hours to help you optimize your earnings.
        </p>
      </div>
    </div>
  );
}
