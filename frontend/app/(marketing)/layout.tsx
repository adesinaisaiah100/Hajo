import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(255,253,249,0.82)] backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-sm font-semibold tracking-[0.24em] text-white">
              SB
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
                SkillBridge
              </p>
              <p className="text-sm text-[var(--color-ink-muted)]">
                Local services with trusted payments
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-ink-muted)] md:flex">
            <a href="#how-it-works">How it works</a>
            <a href="#value">Why it matters</a>
            <a href="#trust">Trust layer</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--color-brand-strong)] sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
            >
              Join SkillBridge
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-[var(--color-line)] bg-[rgba(18,25,22,0.98)] text-white">
        <div className="mx-auto grid min-h-[320px] w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9fceb8]">
              SkillBridge
            </p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight">
              Discovery, escrow, and financial identity in one platform.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/72">
              Built for providers who are skilled but underserved, and for
              customers who want a safer way to find trusted local help.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-white/72 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-semibold text-white">Get started</p>
              <Link href="/register">Create account</Link>
              <Link href="/login">Login with phone</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-white">Phase 1 focus</p>
              <p>Marketing shell</p>
              <p>Auth routing</p>
              <p>API and store wiring</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
