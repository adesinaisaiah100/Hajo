"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";

export function VerificationBanner() {
  const { user, role } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const router = useRouter();

  if (!user || user.verificationTier !== "TIER_0" || isDismissed) {
    return null;
  }

  const verificationPath = role === "customer" ? "/customer/verification" : "/provider/verification";

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-[#f0fdfa] px-6 py-2.5 sm:px-3.5 sm:before:flex-1 border-b border-[#ccfbf1]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-[#0f766e]">
          <strong className="font-semibold flex items-center gap-1.5 inline-flex">
            <AlertCircle className="h-4 w-4" /> Verify your identity
          </strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          Complete verification to unlock your Squad virtual account and build trust.
        </p>
        <Link
          href={verificationPath}
          className="flex-none rounded-full bg-[#14b8a6] px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-[#0d9488] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14b8a6] transition flex items-center gap-1"
        >
          Go to Trust Center <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" onClick={() => setIsDismissed(true)} className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
