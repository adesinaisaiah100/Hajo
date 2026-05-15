import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14b8a6] text-sm font-bold tracking-wider text-white">
              SB
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#14b8a6]">
                SkillBridge
              </p>
              <p className="text-xs text-[#6b7280]">
                Local services with trusted payments
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b7280] md:flex">
            <a href="#how-it-works">How it works</a>
            <a href="#value">Why it matters</a>
            <a href="#trust">Trust layer</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-[#14b8a6] transition hover:text-[#0d9488] sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-lg bg-[#14b8a6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d9488]"
            >
              Join SkillBridge
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-[#e5e7eb] bg-white text-[#111827]">
        <div className="mx-auto grid min-h-[320px] w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#14b8a6]">
              SkillBridge
            </p>
            <h2 className="max-w-xl text-2xl font-bold tracking-tight">
              Discovery, escrow, and financial identity in one platform.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[#6b7280]">
              Built for providers who are skilled but underserved, and for
              customers who want a safer way to find trusted local help.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-[#6b7280] sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-semibold text-[#111827]">Get started</p>
              <Link href="/register">Create account</Link>
              <Link href="/login">Login with phone</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-[#111827]">Company</p>
              <Link href="#">About Us</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
