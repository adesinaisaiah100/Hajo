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
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-[#123227] p-8 text-white shadow-2xl">
        <Link
          href="/"
          className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a7d5c0]"
        >
          Back to landing
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[#9fceb8]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-base leading-8 text-white/78">
          {description}
        </p>

        <div className="mt-10 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-5 text-sm leading-7 text-white/72">
          <p>
            Phone-first authentication keeps the flow accessible for providers
            who mainly operate from mobile devices.
          </p>
          <p>
            Every completed job later becomes financial signal, so onboarding
            must feel simple enough to finish quickly.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-6 shadow-xl sm:p-8">
        {children}
      </div>
    </div>
  );
}