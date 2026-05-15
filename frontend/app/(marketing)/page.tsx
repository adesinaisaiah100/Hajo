import { AppShell } from "@/app/components/shared/AppShell";
import { Button } from "@/app/components/ui/Button";

export default function MarketingHomePage() {
  return (
    <AppShell className="px-4 py-8 sm:px-8 sm:py-16">
      {/* Hero Section */}
      <section className="grid gap-10 lg:gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
          <div className="inline-flex rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#14b8a6] shadow-sm">
            ✨ Marketplace + Escrow + Identity
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              Find skilled artisans you can trust. <span className="text-[#14b8a6]">Book, pay safely</span>, every time.
            </h1>
            <p className="mx-auto lg:mx-0 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
              Hajo connects you to verified local artisans — plumbers, electricians, tailors and more — with AI-powered matching, secure escrow payments, and a trust score that means something.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="/register" size="lg" className="w-full sm:w-auto text-base">
              Get Started Free
            </Button>
            <Button href="/login" variant="secondary" size="lg" className="w-full sm:w-auto text-base">
              Sign In
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-[#e5e7eb]">
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">5 min</p>
              <p className="text-[10px] sm:text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Setup</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">100%</p>
              <p className="text-[10px] sm:text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Verified</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">Escrow</p>
              <p className="text-[10px] sm:text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Protected</p>
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="flex items-center justify-center order-first lg:order-last">
          <div className="w-full max-w-md aspect-square bg-[#f9fafb] border border-[#e5e7eb] rounded-3xl flex flex-col items-center justify-center space-y-4 p-8 shadow-sm">
            <div className="text-5xl">📱</div>
            <span className="text-center text-sm font-medium text-[#6b7280]">
              Mobile App Experience
            </span>
          </div>
        </div>
      </section>

      {/* How It Works - Three Steps */}
      <section className="mt-16 sm:mt-24 space-y-10">
        <div className="text-center space-y-3 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">
            Three simple steps to start
          </h2>
          <p className="text-base sm:text-lg text-[#6b7280]">
            From signup to your first booking in under 5 minutes
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {[
            {
              step: "01",
              title: "Register with phone",
              desc: "Quick signup using OTP verification. No passwords, no friction.",
              icon: "📞",
            },
            {
              step: "02",
              title: "Create your wallet",
              desc: "Instant access to escrow payments, transfers, and transaction history.",
              icon: "💳",
            },
            {
              step: "03",
              title: "Start working",
              desc: "For providers: get discovered. For customers: find trusted help nearby.",
              icon: "✨",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#14b8a6]">
                  Step {item.step}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">{item.title}</h3>
              <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Propositions - Two Columns */}
      <section className="mt-16 sm:mt-24 grid gap-12 lg:gap-16 lg:grid-cols-2">
        {/* For Service Providers */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              For service providers
            </h3>
            <p className="text-base sm:text-lg text-[#6b7280]">
              Build your reputation and financial identity with every job completed
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "Get discovered by customers who need your skills",
              "Receive payments safely with escrow protection",
              "Build verified financial history from every transaction",
              "Access dashboard with earnings and analytics",
            ].map((benefit) => (
              <li key={benefit} className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center text-white flex-shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </div>
                <span className="text-sm sm:text-base text-[#111827] leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="w-full aspect-video bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-[#6b7280]">Dashboard Preview</span>
          </div>
        </div>

        {/* For Customers */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              For customers
            </h3>
            <p className="text-base sm:text-lg text-[#6b7280]">
              Find trusted, verified providers with safe payment and fair pricing
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "Search for providers using natural language",
              "See verified ratings, reviews, and profiles",
              "Book with safe escrow payment protection",
              "Release payment only after job confirmation",
            ].map((benefit) => (
              <li key={benefit} className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center text-white flex-shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </div>
                <span className="text-sm sm:text-base text-[#111827] leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="w-full aspect-video bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-[#6b7280]">Search Interface Preview</span>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="mt-16 sm:mt-24 rounded-3xl bg-[#f0fdfa] border border-[#ccfbf1] p-6 sm:p-12 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Built on trust and verified identity
            </h2>
            <p className="text-base sm:text-lg text-[#6b7280] leading-relaxed">
              Every user is phone-verified. Every transaction is recorded. Every reputation is built from real activity, not promises.
            </p>

            <div className="pt-4 space-y-4 border-t border-[#ccfbf1]">
              <div className="flex gap-4">
                <span className="text-2xl sm:text-3xl">🔒</span>
                <div>
                  <p className="font-bold text-[#111827]">Escrow Protection</p>
                  <p className="text-sm text-[#6b7280]">Funds held safely until job confirmation</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl sm:text-3xl">✔️</span>
                <div>
                  <p className="font-bold text-[#111827]">Phone Verified</p>
                  <p className="text-sm text-[#6b7280]">All users verified through OTP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full aspect-square bg-white border border-[#e5e7eb] rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-[#6b7280]">Security Features</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 sm:mt-24 rounded-3xl border border-[#e5e7eb] bg-white p-8 sm:p-12 space-y-6 sm:space-y-8 text-center shadow-sm">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">Ready to join Hajo?</h2>
          <p className="text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto">
            Sign up in 5 minutes. No hidden fees. Get discovered or find trusted help today.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/register" size="lg" className="w-full sm:w-auto text-base">
            Create Your Account
          </Button>
          <Button href="/login" variant="secondary" size="lg" className="w-full sm:w-auto text-base">
            Sign In
          </Button>
        </div>
      </section>

      {/* Bottom Section - Additional Info */}
      <section className="mt-16 sm:mt-24 grid gap-6 sm:gap-8 lg:grid-cols-3 text-center pb-8">
        {[
          {
            stat: "24/7",
            label: "Customer Support",
            desc: "Help whenever you need it",
          },
          {
            stat: "Nigeria",
            label: "Current Market",
            desc: "Scaling to other regions soon",
          },
          {
            stat: "Open",
            label: "For Everyone",
            desc: "No prerequisites or barriers",
          },
        ].map((item) => (
          <div key={item.label} className="space-y-2 rounded-2xl bg-[#f9fafb] p-6 border border-[#e5e7eb]">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#14b8a6]">{item.stat}</p>
            <p className="font-bold text-[#111827]">{item.label}</p>
            <p className="text-sm text-[#6b7280]">{item.desc}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
