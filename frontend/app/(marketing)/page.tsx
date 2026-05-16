"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  UserCircle2, 
  ClipboardList, 
  CreditCard, 
  Smartphone, 
  Briefcase, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  Zap,
  Plus,
  HardHat
} from "lucide-react";
import { AppShell } from "@/app/components/shared/AppShell";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

export default function MarketingHomePage() {
  const [activeTab, setActiveTab] = useState<"customer" | "artisan">("customer");

  return (
    <div className="bg-white">
      {/* SECTION 2 — HERO */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <AppShell className="px-4 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <p className="inline-flex items-center rounded-full bg-[#f0fdfa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                  Connecting Nigeria&apos;s skilled workforce
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
                  Nigeria&apos;s skilled artisans <span className="text-[#14b8a6]">deserve to be found.</span>
                </h1>
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-[#6b7280] lg:mx-0">
                  Hajo connects you to verified local artisans — plumbers, electricians, tailors, and more — with AI-powered matching, secure escrow payments, and a trust score built from real work.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button href="/register?role=provider" variant="secondary" size="lg" className="h-14 px-8 text-base">
                  Join Hajo
                </Button>
              </div>

              <p className="text-sm font-medium text-[#9ca3af]">
                Verified artisans &middot; Escrow-protected payments &middot; Powered by Squad API
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
              <div className="aspect-square rounded-[40px] bg-gradient-to-br from-[#f0fdfa] to-white p-4 shadow-2xl ring-1 ring-black/5">
                <div className="h-full w-full rounded-[32px] border-2 border-dashed border-[#ccfbf1] bg-white flex items-center justify-center p-8 overflow-hidden relative">
                  {/* Hero visual representation */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
                  <div className="z-10 grid grid-cols-2 gap-4 w-full">
                    <div className="space-y-4">
                      <div className="h-40 rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] p-4 flex flex-col justify-end">
                        <div className="w-12 h-12 rounded-full bg-[#14b8a6] mb-3" />
                        <div className="w-24 h-3 rounded-full bg-[#e5e7eb] mb-2" />
                        <div className="w-16 h-2 rounded-full bg-[#f3f4f6]" />
                      </div>
                      <div className="h-24 rounded-2xl bg-white border border-[#e5e7eb] shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-[#14b8a6]" />
                          <div className="w-12 h-2 rounded-full bg-[#e5e7eb]" />
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#f3f4f6]" />
                      </div>
                    </div>
                    <div className="pt-12 space-y-4">
                      <div className="h-32 rounded-2xl bg-white border border-[#e5e7eb] shadow-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#f3f4f6]" />
                          <div className="px-2 py-1 rounded-full bg-[#fef3c7] text-[8px] font-bold text-[#92400e]">GOLD TIER</div>
                        </div>
                        <div className="w-full h-3 rounded-full bg-[#f3f4f6] mb-2" />
                        <div className="w-20 h-2 rounded-full bg-[#f3f4f6]" />
                      </div>
                      <div className="h-44 rounded-2xl bg-[#111827] p-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 mb-4" />
                        <div className="space-y-2">
                          <div className="w-full h-2 rounded-full bg-white/20" />
                          <div className="w-full h-2 rounded-full bg-white/20" />
                          <div className="w-2/3 h-2 rounded-full bg-white/10" />
                        </div>
                        <div className="mt-8 h-8 rounded-lg bg-[#14b8a6]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 3 — STATS BAR */}
      <div className="border-y border-[#e5e7eb] bg-[#f9fafb]">
        <AppShell className="px-4 py-12 sm:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center md:text-left">
              <p className="text-3xl font-extrabold text-[#111827]">38.4M</p>
              <p className="mt-1 text-sm text-[#6b7280]">Informal artisans in Nigeria waiting to be found</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-extrabold text-[#111827]">₦0</p>
              <p className="mt-1 text-sm text-[#6b7280]">Cost for artisans to join and start earning</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-extrabold text-[#111827]">100%</p>
              <p className="mt-1 text-sm text-[#6b7280]">Escrow-protected — your money is safe until the job is done</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-extrabold text-[#111827]">4 mins</p>
              <p className="mt-1 text-sm text-[#6b7280]">Average time to find and book a trusted artisan near you</p>
            </div>
          </div>
        </AppShell>
      </div>

      {/* SECTION 4 — THE PROBLEM */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#9ca3af]">Why Hajo exists</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl leading-tight">
              The referral chain is broken.<br />There is a better way.
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-start relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#e5e7eb] hidden lg:block" />
            
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-[#f0f9ff] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#0369a1]">
                For people who need help
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">You need a plumber. Urgently.</h3>
              <div className="space-y-4 text-[#6b7280] leading-relaxed">
                <p>You call the one number you have. No answer. You ask your neighbour. They give you another name. That person shows up two hours late, names a price you cannot question, collects cash, and leaves.</p>
                <p>You spend the next week hoping the pipe holds.</p>
                <p className="font-semibold text-[#111827]">Finding a skilled, trustworthy artisan in Nigeria should not feel like a gamble. But right now, it does.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-[#fdf2f8] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#9d174d]">
                For artisans who deserve more
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">Moshood has been a plumber for 11 years.</h3>
              <div className="space-y-4 text-[#6b7280] leading-relaxed">
                <p>He is skilled. His customers love him. But every single job he gets depends on someone remembering his name. He has no profile. No business record. No way to prove 11 years of reliable work.</p>
                <p>When he walks into a bank, he walks out empty-handed. No transaction history. No credit. No financial identity.</p>
                <p className="font-semibold text-[#111827]">Moshood deserves better. So do the 38 million artisans like him.</p>
              </div>
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 5 — THE SOLUTION / HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#f9fafb]">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">How Hajo works</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Simple for customers.<br />Transformative for artisans.
            </h2>
            <p className="text-lg text-[#6b7280]">Two sides of the same platform &mdash; each designed for the person using it.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-1 bg-white border border-[#e5e7eb] rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab("customer")}
                className={cn(
                  "px-8 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === "customer" ? "bg-[#14b8a6] text-white shadow-md" : "text-[#6b7280] hover:text-[#111827]"
                )}
              >
                For Customers
              </button>
              <button
                onClick={() => setActiveTab("artisan")}
                className={cn(
                  "px-8 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === "artisan" ? "bg-[#14b8a6] text-white shadow-md" : "text-[#6b7280] hover:text-[#111827]"
                )}
              >
                For Artisans
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {activeTab === "customer" ? (
              <>
                {[
                  { step: "01", icon: Search, title: "Describe what you need", body: "Type your request in plain language — \"I need an electrician in Surulere this weekend\" — and our AI finds the most suitable verified artisans near you. Not just the closest. The most relevant." },
                  { step: "02", icon: UserCircle2, title: "Review and choose with confidence", body: "See each artisan's trust score, completed jobs, customer reviews, portfolio, and verified identity — all in one place. Every profile is real. Every artisan is verified." },
                  { step: "03", icon: ClipboardList, title: "Receive a clear quotation", body: "For jobs that involve materials, your artisan sends you an itemised quotation — labour, materials, total — before you pay a single naira. Review it, ask questions, negotiate if needed." },
                  { step: "04", icon: CreditCard, title: "Pay safely. Every time.", body: "Your payment is held securely in escrow until you confirm" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-[32px] p-8 border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] flex items-center justify-center text-[#14b8a6] mb-6">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-[#14b8a6] mb-2 uppercase tracking-widest">Step {item.step}</p>
                    <h4 className="text-xl font-bold text-[#111827] mb-3 leading-tight">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-[#6b7280]">{item.body}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { step: "01", icon: Smartphone, title: "Join in minutes", body: "Sign up with your phone number. Build your profile, services, prices, and photos. You are live and discoverable immediately." },
                  { step: "02", icon: Briefcase, title: "Get a business account", body: "Hajo creates a dedicated business wallet for you — powered by Squad. Every payment you receive goes there, organized and professional." },
                  { step: "03", icon: TrendingUp, title: "Build your identity", body: "Every job, review, and on-time delivery builds your trust score. A verifiable record of your work that banks can finally see." },
                  { step: "04", icon: Zap, title: "Grow your business", body: "Your dashboard shows earnings, performance, and AI-generated insights on how to earn more. You are running a real business." },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-[32px] p-8 border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#f59e0b] mb-6">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-[#f59e0b] mb-2 uppercase tracking-widest">Step {item.step}</p>
                    <h4 className="text-xl font-bold text-[#111827] mb-3 leading-tight">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-[#6b7280]">{item.body}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </AppShell>
      </section>

      {/* SECTION 6 — THE TRUST SCORE */}
      <section id="trust" className="py-24 lg:py-32">
        <AppShell className="px-4 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">The credibility system</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl leading-tight">
                Your work history.<br />Finally made visible.
              </h2>
              <p className="text-lg leading-relaxed text-[#6b7280]">
                Hajo&apos;s trust score is not a rating out of five stars. It is a living financial record &mdash; built from every job you complete, every payment you receive, and every customer you satisfy.
              </p>
              <div className="pt-6 grid grid-cols-2 gap-4">
                {[
                  { label: "Bronze", icon: "🥉", color: "text-[#78350f]" },
                  { label: "Silver", icon: "🥈", color: "text-[#6b7280]" },
                  { label: "Gold", icon: "🥇", color: "text-[#d97706]" },
                  { label: "Platinum", icon: "💎", color: "text-[#8b5cf6]" },
                ].map((tier) => (
                  <div key={tier.label} className="flex items-center gap-2 p-3 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb]">
                    <span className="text-xl">{tier.icon}</span>
                    <span className={cn("font-bold text-sm", tier.color)}>{tier.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-[#111827] italic">
                Platinum artisans on Hajo are building the credit history that could qualify them for working capital loans &mdash; without ever walking into a bank.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Jobs completed", body: "Every finished booking adds to your score. The more you work, the higher you climb.", icon: CheckCircle2 },
                { title: "Total earned", body: "Your processed earnings are transparent, verified, and attributed to you &mdash; not a personal account.", icon: CreditCard },
                { title: "Customer ratings", body: "Real reviews from verified customers who actually used your service. Not anonymous. Not fake.", icon: Star },
                { title: "Platform tenure", body: "Consistency over time is rewarded. The longer you deliver on Hajo, the stronger your identity becomes.", icon: TrendingUp },
              ].map((card, i) => (
                <div key={i} className="p-8 rounded-[32px] border border-[#e5e7eb] bg-white shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f9fafb] flex items-center justify-center text-[#111827]">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#111827]">{card.title}</h4>
                  <p className="text-sm leading-relaxed text-[#6b7280]">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 7 — THE QUOTATION FEATURE */}
      <section className="py-24 bg-[#111827] text-white rounded-[48px] mx-4 sm:mx-8">
        <AppShell className="px-8 sm:px-16">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Smart quotations</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              No more awkward price negotiations.<br />No more cash surprises.
            </h2>
            <p className="text-lg text-[#9ca3af]">For jobs that need materials, Hajo generates a professional itemised quotation automatically.</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3 mb-20">
            {[
              { icon: "🤖", title: "AI-generated draft", body: "Describe the job. Our AI reads it and generates a quotation with estimated materials and labour." },
              { icon: "✏️", title: "Artisan reviewed", body: "The artisan checks every line item, adjusts prices if needed, and approves before it reaches you." },
              { icon: "💬", title: "Customer approved", body: "Review it, ask questions, negotiate if needed, and pay only when you are satisfied." },
            ].map((col, i) => (
              <div key={i} className="space-y-6 text-center lg:text-left">
                <div className="text-4xl">{col.icon}</div>
                <h4 className="text-xl font-bold">{col.title}</h4>
                <p className="text-[#9ca3af] leading-relaxed">{col.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[32px] bg-white/5 border border-white/10 p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-[#14b8a6]" />
            </div>
            <div className="max-w-2xl relative z-10">
              <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#14b8a6]" />
                Split escrow &mdash; a smarter way to pay
              </h4>
              <div className="space-y-4 text-lg text-[#9ca3af] leading-relaxed">
                <p>When a job needs materials, your payment splits automatically. The materials advance releases immediately so the artisan can buy what they need and start the job.</p>
                <p>Your labour payment stays protected in escrow until the job is confirmed complete.</p>
                <p className="font-bold text-white">Everyone is protected. Everything moves forward.</p>
              </div>
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 8 — FOR ARTISANS */}
      <section id="for-artisans" className="py-24 lg:py-32">
        <AppShell className="px-4 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 grid gap-6 sm:grid-cols-2">
              {[
                { title: "Get found by thousands", body: "Your profile is searchable by customers city-wide. Stop waiting for referrals. Start receiving bookings.", icon: Search },
                { title: "Get paid like a business", body: "Track earnings in your Hajo wallet. Withdraw to any bank. Know exactly what you made this month.", icon: CreditCard },
                { title: "Look professional", body: "Send branded, itemised quotations. No more quoting from memory. No more price disputes.", icon: ClipboardList },
                { title: "Build financial identity", body: "Your jobs and earnings form a record the formal economy can finally see. Built for your future.", icon: TrendingUp },
              ].map((card, i) => (
                <div key={i} className="p-8 rounded-[32px] border border-[#e5e7eb] bg-white hover:border-[#14b8a6] transition-colors group">
                  <card.icon className="h-6 w-6 text-[#14b8a6] mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold text-[#111827] mb-3 leading-tight">{card.title}</h4>
                  <p className="text-sm leading-relaxed text-[#6b7280]">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Built for the people who build Nigeria</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl leading-tight">
                  You have the skill.<br />Hajo gives you everything else.
                </h2>
                <p className="text-lg leading-relaxed text-[#6b7280]">
                  Join thousands of artisans across Lagos who are growing their business, earning more, and building a financial identity &mdash; all from their phone.
                </p>
              </div>
              <div className="space-y-4">
                <Button href="/register?role=provider" size="lg" className="h-14 px-8 text-base">
                  Join Hajo &mdash; it takes 3 minutes
                </Button>
                <p className="text-sm text-[#9ca3af] font-medium">No subscription fee. No upfront cost. You pay nothing until you earn.</p>
              </div>
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 9 — FOR CUSTOMERS */}
      <section id="for-customers" className="py-24 bg-[#f9fafb]">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Find someone you can actually trust</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Verified artisans. Safe payments. No surprises.
            </h2>
            <p className="text-lg text-[#6b7280]">Every artisan on Hajo is verified, reviewed, and scored. You see their track record before you book. You pay safely through escrow. And if something goes wrong, you are protected.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { title: "AI finds the right person for your job", body: "Describe what you need in plain language. Our AI matches you to the most suitable verified artisan near you — factoring in skill, availability, location, and rating.", icon: Zap },
              { title: "See the full picture before you decide", body: "Trust scores. Completed jobs. Customer reviews. Portfolio photos. Client references. You have everything you need to make a confident decision.", icon: UserCircle2 },
              { title: "Your money is protected — always", body: "Pay through your Hajo wallet. Funds are held in escrow until you confirm the job is done to your satisfaction. You are never at risk.", icon: ShieldCheck },
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white border border-[#e5e7eb] shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#f0fdfa] text-[#14b8a6] flex items-center justify-center mb-8">
                  <card.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-[#111827] mb-4">{card.title}</h4>
                <p className="text-base leading-relaxed text-[#6b7280]">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button href="/register" size="lg" className="h-14 px-10 text-base">
              Start onboarding
            </Button>
          </div>
        </AppShell>
      </section>

      {/* SECTION 10 — HOW THE ESCROW WORKS */}
      <section className="py-24 lg:py-32">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Payment protection</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Your money moves only when you say it does.
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#f0fdfa] -translate-y-1/2 hidden lg:block" />
            <div className="grid gap-8 lg:grid-cols-5 relative z-10">
              {[
                { step: 1, title: "You book and pay", body: "Your payment is charged from your Hajo wallet and held securely by our payment partner, Squad." },
                { step: 2, title: "Materials released", body: "For jobs with materials, the materials portion is released to the artisan immediately so they can buy what is needed and begin." },
                { step: 3, title: "Work begins", body: "The artisan starts the job. Your labour payment stays safely in escrow throughout." },
                { step: 4, title: "You confirm completion", body: "When the job is done to your satisfaction, you tap confirm. If the artisan does not deliver, you raise a dispute — and your money stays protected." },
                { step: 5, title: "Artisan gets paid", body: "The moment you confirm, the payment releases to the artisan's wallet. Fast, transparent, and fair to everyone." },
              ].map((item) => (
                <div key={item.step} className="bg-white p-6 rounded-3xl border border-[#e5e7eb] relative group hover:border-[#14b8a6] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#14b8a6] text-white flex items-center justify-center font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-[#111827] mb-2">{item.title}</h4>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm font-medium text-[#9ca3af]">
              Powered by Squad API — Nigeria&apos;s trusted payment infrastructure.
            </p>
          </div>
        </AppShell>
      </section>

      {/* SECTION 11 — CATEGORIES */}
      <section className="py-24">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Who you can find on Hajo</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl leading-tight">
              Every trade. Every skill. Near you.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Plumbers", icon: "🔧" },
              { label: "Electricians", icon: "⚡" },
              { label: "Barbers", icon: "💈" },
              { label: "Hair Stylists", icon: "💇" },
              { label: "Tailors & Seamstresses", icon: "🧵" },
              { label: "Carpenters", icon: "🪚" },
              { label: "Painters", icon: "🎨" },
              { label: "Cleaners", icon: "🧹" },
              { label: "Event Planners", icon: "👰" },
              { label: "Caterers & Chefs", icon: "🍽️" },
              { label: "Logistics & Delivery", icon: "🚛" },
              { label: "Welders", icon: "🔩" },
              { label: "Tilers & Floor Layers", icon: "🏠" },
              { label: "Phone Repair Technicians", icon: "📱" },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 rounded-3xl border border-[#e5e7eb] bg-white hover:border-[#14b8a6] hover:shadow-lg transition-all group cursor-default">
                <span className="text-4xl mb-4 group-hover:scale-110 transition-all">{cat.icon}</span>
                <span className="text-sm font-bold text-[#111827] text-center">{cat.label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-[#e5e7eb] bg-[#f9fafb] hover:border-[#14b8a6] transition-all group cursor-pointer">
              <Plus className="h-8 w-8 text-[#9ca3af] mb-4 group-hover:text-[#14b8a6]" />
              <span className="text-sm font-bold text-[#6b7280]">And many more</span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/register?role=provider" className="text-sm font-bold text-[#14b8a6] hover:text-[#0d9488] flex items-center justify-center gap-2">
              Don&apos;t see your trade? Register anyway <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AppShell>
      </section>

      {/* SECTION 12 — TESTIMONIALS */}
      <section className="py-24 bg-[#111827] text-white">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Real people. Real results.</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              What Hajo means to the<br />people using it.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { 
                quote: "Before Hajo I was just a name in someone's phone. Now I have a profile, a business wallet, and customers calling me from places I have never even worked before. My Gold score took four months to build. I am not giving that up for anything.", 
                author: "Moshood A.", 
                title: "Plumber · Yaba, Lagos · Gold ⭐", 
                avatar: "https://i.pravatar.cc/150?u=moshood"
              },
              { 
                quote: "I needed an electrician at 8am on a Saturday. I typed what I needed, saw three options with their scores and reviews, picked one, paid through the app, and he was at my door by 10. The job was done by noon. The money left my wallet only after I confirmed it was done. That is exactly how it should work.", 
                author: "Amaka O.", 
                title: "Customer · Lekki, Lagos", 
                avatar: "https://i.pravatar.cc/150?u=amaka"
              },
              { 
                quote: "The quotation feature changed everything for me. I used to quote from memory and sometimes forget things. Now the app generates it for me, I just check and adjust, and my customer sees a professional document with my name on it. It makes me look serious.", 
                author: "Emeka K.", 
                title: "Electrician · Surulere, Lagos · Silver ⭐", 
                avatar: "https://i.pravatar.cc/150?u=emeka"
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[40px] flex flex-col">
                <p className="text-lg leading-relaxed text-white italic mb-8 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-12 h-12 rounded-full border-2 border-[#14b8a6]" alt={t.author} />
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-xs text-[#9ca3af]">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AppShell>
      </section>

      {/* SECTION 13 — TRUST & SAFETY */}
      <section id="trust" className="py-24 lg:py-32 bg-[#f9fafb]">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Built on trust. Designed for safety.</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Every layer verified. Every transaction protected.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Smartphone, title: "Phone verification", body: "Every user on Hajo — artisan and customer — verifies their phone number before accessing the platform. No anonymous accounts." },
              { icon: ShieldCheck, title: "Identity verification", body: "Artisans can verify their NIN and BVN to unlock higher trust tiers. The deeper the verification, the higher the score." },
              { icon: CreditCard, title: "Escrow payments", body: "No money changes hands directly. Every transaction runs through Squad's secure escrow — released only on confirmation." },
              { icon: Star, title: "Verified reviews", body: "Only customers who have completed a booking can leave a review. No fake ratings. Every review is tied to a real transaction." },
            ].map((pillar, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-[#e5e7eb] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] text-[#14b8a6] flex items-center justify-center mb-6">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111827] mb-3">{pillar.title}</h4>
                <p className="text-sm leading-relaxed text-[#6b7280]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </AppShell>
      </section>

      {/* SECTION 14 — FAQ */}
      <section className="py-24 lg:py-32">
        <AppShell className="px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#14b8a6]">Common questions</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Everything you need to know.
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <UserCircle2 className="h-6 w-6 text-[#14b8a6]" /> For Customers
              </h3>
              <div className="space-y-6">
                {[
                  { 
                    q: "Is Hajo free to use as a customer?", 
                    a: "Yes. Creating an account and searching for artisans is completely free. You only pay when you book a service — and that payment is protected by escrow until you confirm the job is done." 
                  },
                  { 
                    q: "What happens if the artisan does not show up?", 
                    a: "Your payment is held in escrow and never reaches the artisan until you confirm completion. If the artisan does not show up or does not deliver, you raise a dispute — and your money is returned to your wallet." 
                  },
                  { 
                    q: "How do I fund my Hajo wallet?", 
                    a: "When you create an account, Hajo gives you a dedicated virtual account number — a real NUBAN bank account powered by Squad. Transfer any amount to that account from any Nigerian bank and it reflects in your wallet instantly." 
                  },
                  {
                    q: "How do I know the artisan is trustworthy?",
                    a: "Every artisan has a trust score built from their verified identity, completed jobs, customer reviews, and platform history. You can see their full record — including previous client references — before you book."
                  }
                ].map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <p className="font-bold text-[#111827]">{faq.q}</p>
                    <p className="text-sm text-[#6b7280] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <HardHat className="h-6 w-6 text-[#f59e0b]" /> For Artisans
              </h3>
              <div className="space-y-6">
                {[
                  { 
                    q: "How much does it cost to join Hajo as an artisan?", 
                    a: "Nothing. Joining Hajo is completely free. We take a 1.5% platform fee only when a payment is successfully completed. You pay nothing until you earn." 
                  },
                  { 
                    q: "How do I receive my payment?", 
                    a: "When a job is confirmed complete, your earnings are released to your Hajo business wallet immediately. You can withdraw to any Nigerian bank account at any time." 
                  },
                  { 
                    q: "What is the trust score and why does it matter?", 
                    a: "Your trust score is a number between 0 and 100 — Bronze, Silver, Gold, or Platinum — built from your completed jobs, total earnings, customer ratings, and time on the platform. A higher score means more customers find you and trust you." 
                  },
                  {
                    q: "Do I need a smartphone to use Hajo?",
                    a: "Hajo works in any modern mobile browser — no app download required. If you can open a website on your phone, you can use Hajo."
                  },
                  { 
                    q: "What is the quotation feature?", 
                    a: "For jobs that involve buying materials — like plumbing or electrical work — Hajo automatically generates a professional itemised quotation based on the customer's job description. You review it, adjust any prices, and send it to the customer before any payment happens." 
                  },
                ].map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <p className="font-bold text-[#111827]">{faq.q}</p>
                    <p className="text-sm text-[#6b7280] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppShell>
      </section>

      {/* SECTION 15 — FINAL CTA */}
      <section className="py-24 bg-[#14b8a6] rounded-[64px] mx-4 sm:mx-8 mb-20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-64 h-64 text-white" />
        </div>
        <AppShell className="px-8 sm:px-16 relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8 text-white">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
              Moshood worked for 11 years with nothing to show a bank.<br />
              <span className="text-[#111827]">After 8 months on Hajo — he qualified for his first business loan.</span>
            </h2>
            <p className="text-xl text-[#ccfbf1] font-medium max-w-2xl mx-auto">
              That is what Hajo is building. One artisan at a time.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
              <Button href="/register?role=provider" size="lg" className="h-16 px-10 text-lg bg-[#111827] hover:bg-black border-none shadow-xl">
                Join Hajo today
              </Button>
              <Button href="/register" variant="secondary" size="lg" className="h-16 px-10 text-lg bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md">
                Start onboarding
              </Button>
            </div>
            <p className="text-sm text-[#ccfbf1] font-medium">
              Join the platform that is giving Nigeria&apos;s informal economy a financial identity.
            </p>
          </div>
        </AppShell>
      </section>
    </div>
  );
}
