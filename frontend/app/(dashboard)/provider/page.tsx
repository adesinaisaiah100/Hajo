"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Plus, ExternalLink, Calendar, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { BookingCard } from "@/app/components/shared/BookingCard";
import { EarningsChart } from "@/app/components/provider/EarningsChart";
import { ScoreBadge } from "@/app/components/shared/ScoreBadge";
import { Button } from "@/app/components/ui/Button";
import { useAuthStore } from "@/app/store/auth.store";
import { getMockBookings, getMockWallet, getMockProvider } from "@/app/lib/mock-marketplace";

export default function ProviderDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const providerId = user?.provider?.id || "prov-1";

  // In real app, this would use a real API call via useQuery
  const { data: bookings } = useQuery({
    queryKey: ["provider-bookings", user?.id],
    queryFn: async () => getMockBookings("provider", user?.id),
    initialData: [],
  });

  const { data: provider } = useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => getMockProvider(providerId),
  });

  const wallet = getMockWallet("provider");

  const recentBookings = bookings.slice(0, 5);
  
  // Mock chart data
  const chartData = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 150000 },
    { month: "Mar", amount: 180000 },
    { month: "Apr", amount: 140000 },
    { month: "May", amount: 200000 },
    { month: "Jun", amount: 248000 },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Good morning, {user?.firstName || provider?.name?.split(' ')[0] || 'Provider'}. Here&apos;s your business today.
        </h1>
      </div>

      {/* Credit Score Banner */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6]">
             {/* Using ScoreBadge just for the visual or just simple text */}
             <span className="text-xl font-bold text-[#111827]">67</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#111827]">Your Credit Score</h2>
              {provider && <ScoreBadge tier={provider.tier} />}
            </div>
            <p className="text-sm text-[#6b7280]">
              You need 8 more completed jobs to reach Platinum.
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/provider/score">View full breakdown</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Total Earned</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111827]">
            ₦{wallet.totalEarnings?.toLocaleString() || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Jobs Completed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{provider?.jobsCompleted || 0}</p>
        </div>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Rating</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{provider?.rating || '0.0'}</p>
        </div>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Active Bookings</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111827]">
            {bookings.filter(b => b.status === "ACCEPTED").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard 
            title="Revenue Overview" 
            action={
              <Link href="/provider/analytics" className="text-sm font-medium text-[#14b8a6] hover:text-[#0d9488]">
                View all analytics
              </Link>
            }
          >
            <EarningsChart data={chartData} />
          </SectionCard>

          <SectionCard 
            title="Recent Bookings" 
            action={
              <Link href="/provider/bookings" className="text-sm font-medium text-[#14b8a6] hover:text-[#0d9488]">
                View all
              </Link>
            }
          >
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} role="provider" />
                ))
              ) : (
                <p className="text-sm text-[#6b7280]">No recent bookings.</p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          <SectionCard title="Quick Actions">
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/provider/services">
                  <span>Add a service</span>
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/provider/profile">
                  <span>Edit profile</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/provider/wallet">
                  <span>Withdraw funds</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SectionCard>

          <div className="rounded-2xl bg-[#f0fdfa] border border-[#ccfbf1] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#ccfbf1] p-2">
                <Lightbulb className="h-5 w-5 text-[#0d9488]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#111827]">Business Tip</h3>
                <p className="mt-1 text-sm text-[#0f766e]">
                  Saturdays are your peak day. Consider updating your availability for weekends to capture more bookings.
                </p>
                <Link href="/provider/insights" className="mt-3 inline-block text-xs font-medium text-[#14b8a6] hover:underline">
                  See all insights →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lightbulb component inline just for the tip icon
function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
