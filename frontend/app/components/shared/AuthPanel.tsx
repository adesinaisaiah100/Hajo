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
    <div className="grid w-full max-w-5xl gap-10 lg:gap-16 lg:grid-cols-[1fr_1.1fr]">
      {/* Left Panel - Hero Content */}
      <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5e7eb] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#14b8a6] transition hover:border-[#14b8a6] hover:bg-[#f9fafb]"
        >
          <span>←</span> Back
        </Link>

        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#14b8a6]">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#111827] lg:text-5xl">
            {title}
          </h1>
        </div>

        <p className="max-w-md text-base sm:text-lg leading-relaxed text-[#6b7280]">
          {description}
        </p>

        {/* Feature Highlights */}
        <div className="hidden sm:block space-y-4 rounded-2xl bg-[#f0fdfa] border border-[#ccfbf1] p-6 shadow-sm">
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              ✓
            </div>
            <p className="text-sm leading-relaxed text-[#111827]">
              Phone-first onboarding keeps the flow accessible for providers who mainly work from mobile devices.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              ✓
            </div>
            <p className="text-sm leading-relaxed text-[#111827]">
              Fast registration unlocks wallet creation and booking discovery within minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Card */}
      <div className="flex items-center justify-center">
        <div className="w-full rounded-3xl border border-[#e5e7eb] bg-white p-6 sm:p-10 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}