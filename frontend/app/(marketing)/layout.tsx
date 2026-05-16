import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 — NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-[#111827]">Hajo</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b7280] md:flex">
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How it works</a>
            <a href="#for-artisans" className="hover:text-[#111827] transition-colors">For Artisans</a>
            <a href="#for-customers" className="hover:text-[#111827] transition-colors">For Customers</a>
            <a href="#trust" className="hover:text-[#111827] transition-colors">Trust & Safety</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#6b7280] hover:text-[#111827] transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#14b8a6] px-6 text-sm font-semibold text-white hover:bg-[#0d9488] transition shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* SECTION 16 — FOOTER */}
      <footer className="border-t border-[#e5e7eb] bg-[#f9fafb] pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="text-2xl font-bold tracking-tighter text-[#111827]">Hajo</Link>
              <p className="mt-4 text-sm leading-relaxed text-[#6b7280]">
                The informal economy&apos;s missing layer.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="font-bold text-[#111827]">Platform</p>
              <nav className="flex flex-col gap-3 text-sm text-[#6b7280]">
                <a href="#how-it-works" className="hover:text-[#14b8a6] transition-colors">How it works</a>
                <a href="#for-artisans" className="hover:text-[#14b8a6] transition-colors">For artisans</a>
                <a href="#for-customers" className="hover:text-[#14b8a6] transition-colors">For customers</a>
                <a href="#trust" className="hover:text-[#14b8a6] transition-colors">Trust & safety</a>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Pricing</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-[#111827]">Company</p>
              <nav className="flex flex-col gap-3 text-sm text-[#6b7280]">
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">About us</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Blog</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Careers</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Press</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-[#111827]">Legal</p>
              <nav className="flex flex-col gap-3 text-sm text-[#6b7280]">
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Privacy policy</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Terms of service</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Cookie policy</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-[#111827]">Contact</p>
              <nav className="flex flex-col gap-3 text-sm text-[#6b7280]">
                <a href="mailto:hello@hajo.ng" className="hover:text-[#14b8a6] transition-colors">hello@hajo.ng</a>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">WhatsApp support</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Instagram</Link>
                <Link href="#" className="hover:text-[#14b8a6] transition-colors">Twitter / X</Link>
              </nav>
            </div>
          </div>
          
          <div className="mt-20 border-t border-[#e5e7eb] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#9ca3af]">
              &copy; 2025 Hajo Technologies Ltd. All rights reserved. &middot; Payments powered by Squad API.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
