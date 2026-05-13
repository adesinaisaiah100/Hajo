import { AppShell } from "@/app/components/shared/AppShell";
import { Button } from "@/app/components/ui/Button";

const providerHighlights = [
  "Get discovered by customers in their city who cannot find them on current platforms.",
  "Get paid safely with escrow protecting both parties from failed jobs and payment disputes.",
  "Build a financial identity because every completed job adds to a verifiable score.",
  "Manage bookings, revenue, and customer insights from one dashboard as the platform grows.",
];

const customerHighlights = [
  "Find verified, rated providers nearby using plain language search and AI-powered matching.",
  "Book and pay safely with money held in escrow until the job is confirmed complete.",
  "Trust the platform through phone verification and a visible behavioral track record.",
];

const institutionHighlights = [
  "Access a pre-scored population of informal workers with months of behavioral data.",
  "Skip the KYC cold start because users arrive with real economic activity history.",
  "Consume anonymised credit profiles later through partner-facing API access.",
];

const stats = [
  { value: "5 min", label: "Provider onboarding target" },
  { value: "100%", label: "Phone-verified entry point" },
  { value: "3", label: "Problems solved at once" },
  { value: "Phase 1", label: "Landing, auth shell, API wiring" },
];

export default function MarketingHomePage() {
  return (
    <AppShell className="px-5 py-8 sm:px-8 sm:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand)]">
            Marketplace + escrow + financial identity
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              Local services people can trust. Economic identity providers can
              grow with.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--color-ink-muted)] sm:text-xl">
              SkillBridge is a two-sided marketplace for barbers,
              electricians, plumbers, tailors, caterers, logistics providers,
              and more. Customers discover trusted help, while every completed
              transaction helps providers build a credible financial record.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Join as provider or customer
            </Button>
            <Button href="/login" variant="secondary" size="lg">
              Continue with phone login
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="section-frame rounded-3xl px-5 py-5"
              >
                <p className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-frame relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[rgba(29,107,82,0.18)] via-transparent to-[rgba(216,141,49,0.16)]" />
          <div className="relative space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[#123227] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9fceb8]">
                Built for Nigeria-first growth
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                Discover, book, hold funds in escrow, and build track record
                from one flow.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Every wallet event and completed job becomes behavioral data
                that can unlock future financial products.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
                <p className="text-sm font-semibold text-[var(--color-brand)]">
                  Customer trust layer
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-muted)]">
                  Phone-verified providers, ratings, and safer payment release.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
                <p className="text-sm font-semibold text-[var(--color-brand)]">
                  Provider growth layer
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-muted)]">
                  A visible revenue trail that turns work into formal identity.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,255,255,0.65)] p-5">
              <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                Phase 1 frontend objective
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-ink-muted)]">
                Establish the marketing shell and auth flow structure now so
                marketplace and dashboard phases can grow on a stable route and
                state foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mt-8 grid gap-6 lg:grid-cols-3"
      >
        {[
          {
            step: "01",
            title: "Onboard in minutes",
            body: "Phone-based registration gets providers and customers into the platform quickly, while leaving room for richer profile capture in later phases.",
          },
          {
            step: "02",
            title: "Transact with protection",
            body: "Bookings and payments are designed around escrow so work confirmation, not blind trust, controls fund release.",
          },
          {
            step: "03",
            title: "Turn work into identity",
            body: "Completed jobs, revenue, reviews, and account age become alternative data for a growing financial profile.",
          },
        ].map((item) => (
          <article
            key={item.step}
            className="section-frame rounded-[2rem] p-6 sm:p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Step {item.step}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-ink-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section
        id="value"
        className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <article className="section-frame rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
            The problem
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            SkillBridge solves three linked failures in one system.
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-8 text-[var(--color-ink-muted)]">
            <li>
              <span className="font-semibold text-foreground">
                Informal workers are invisible to the formal economy.
              </span>{" "}
              No transaction history means no credit, no insurance, and no
              financial products.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Customers cannot discover or trust local providers.
              </span>{" "}
              Word-of-mouth is unreliable and there is no built-in verification
              layer.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Financial institutions cannot serve this population.
              </span>{" "}
              They lack usable behavioral data on people already doing real
              business every day.
            </li>
          </ul>
        </article>

        <article
          id="trust"
          className="section-frame rounded-[2rem] p-6 sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
            Trust architecture
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            The landing page makes the product promise concrete.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-ink-muted)]">
            Discovery, verification, escrow, and financial identity show up as
            one connected flow rather than four disconnected features.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
            <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
              Core message
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-muted)]">
              SkillBridge is where informal workers work, get paid, and build a
              financial identity simultaneously.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <ValueCard
          title="For service providers"
          items={providerHighlights}
          tone="brand"
        />
        <ValueCard
          title="For customers"
          items={customerHighlights}
          tone="neutral"
        />
        <ValueCard
          title="For financial institutions"
          items={institutionHighlights}
          tone="accent"
        />
      </section>

      <section className="mt-8 rounded-[2rem] bg-[#12271f] px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9fceb8]">
              Phase 1 ready
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with the shell now. Grow search, booking, wallets, and
              dashboards on top of it next.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="bg-white text-[#12271f] hover:bg-[#f1ebe3]">
              Create an account
            </Button>
            <Button
              href="/login"
              size="lg"
              variant="secondary"
              className="border-white/18 bg-white/8 text-white hover:bg-white/14"
            >
              Try the auth flow
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ValueCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "brand" | "neutral" | "accent";
}) {
  const toneClasses = {
    brand: "bg-[rgba(29,107,82,0.08)]",
    neutral: "bg-white",
    accent: "bg-[rgba(216,141,49,0.09)]",
  };

  return (
    <article className={`section-frame rounded-[2rem] p-6 sm:p-7 ${toneClasses[tone]}`}>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-ink-muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
