"use client";

import { useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { api } from "@/app/services/api";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "@/app/store/toast.store";

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = useMemo(() => searchParams.get("phone") || "", [searchParams]);
  const [otp, setOtp] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAccessToken, setUser } = useAuthStore();
  const otpDigits = useMemo(() => otp.padEnd(6, " ").slice(0, 6).split(""), [otp]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/verify-otp", { phone, otp });
      const { accessToken, user } = response.data?.data || {};

      if (accessToken) {
        setAccessToken(accessToken);
        setUser(user);
        
        // Ensure role in store is updated to lowercase for the shell
        useAuthStore.getState().setRole(user.role.toLowerCase() as "customer" | "provider");
        
        toast.success("Welcome!", `Welcome back, ${user.firstName}`);
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === "PROVIDER") {
            router.push("/provider");
          } else {
            router.push("/search");
          }
        }, 1000);
      }

      setStatus("OTP verified successfully. Redirecting...");
    } catch (error) {
      setStatus(getErrorMessage(error, "Unable to verify OTP right now."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        label="Phone number"
        value={phone}
        placeholder="+234 801 234 5678"
        required
        disabled
      />

      <div className="space-y-4">
        <label className="text-sm font-semibold text-[var(--foreground)]">OTP code</label>
        <p className="text-xs text-[var(--color-ink-muted)]">Enter the 6-digit code sent to your phone</p>
        
        <div
          className="grid grid-cols-6 gap-2 sm:gap-3"
          onClick={() => hiddenInputRef.current?.focus()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              hiddenInputRef.current?.focus();
            }
          }}
        >
          {otpDigits.map((digit, index) => (
            <div
              key={`${digit}-${index}`}
              onClick={() => hiddenInputRef.current?.focus()}
              className="cursor-text flex h-12 sm:h-14 items-center justify-center rounded-lg border-2 border-[var(--color-line)] bg-white text-lg font-bold text-[var(--foreground)] transition-colors focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-[var(--color-brand)]/10"
            >
              {digit.trim() || "•"}
            </div>
          ))}
        </div>

        <input
          ref={hiddenInputRef}
          type="text"
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onPaste={(event) => {
            const pasted = event.clipboardData?.getData("text") || "";
            const digits = pasted.replace(/\D/g, "").slice(0, 6);
            if (digits) setOtp(digits);
          }}
          placeholder="Enter 6-digit OTP"
          inputMode="numeric"
          maxLength={6}
          required
          aria-label="OTP code"
          className="sr-only"
          autoFocus
        />
      </div>

      {status ? (
        <div className="rounded-lg bg-[#ecfdf5] border border-[var(--color-accent)] px-4 py-3">
          <p className="text-sm font-medium text-[#047857]">{status}</p>
        </div>
      ) : null}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Verify OTP
      </Button>

      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Didn&apos;t receive the code?{" "}
        <button type="button" className="text-[var(--color-brand)] hover:text-[var(--color-brand-strong)] font-medium transition-colors">
          Request a new one
        </button>
      </p>
    </form>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}