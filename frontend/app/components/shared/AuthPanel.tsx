import type { ReactNode } from "react";
import Link from "next/link";

export function AuthPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid w-full max-w-5xl gap-8 lg:gap-14 lg:grid-cols-[1fr_1.05fr]">
      {/* Left Panel - Hero Content */}
      <div className="flex flex-col justify-center gap-6 sm:gap-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--foreground)] transition-colors">
          <span className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-brand)] text-xs">←</span>
          <span className="uppercase tracking-wider">Back to home</span>
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-2">{eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-[var(--foreground)] leading-tight">{title}</h2>
        </div>

        <p className="max-w-md text-base leading-relaxed text-[var(--color-ink-muted)]">{description}</p>

        <div className="hidden sm:block mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <ul className="space-y-3 text-sm text-[var(--foreground)]">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white text-xs font-bold">✓</span>
              Phone-first onboarding and progressive verification
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white text-xs font-bold">✓</span>
              Fast wallet creation and escrow flow for artisans
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form Card */}
      <div className="flex items-center justify-center">
        <div className="w-full rounded-2xl border border-[var(--color-line)] bg-white p-8 sm:p-10 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}