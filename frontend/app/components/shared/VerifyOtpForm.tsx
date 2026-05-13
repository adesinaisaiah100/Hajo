"use client";

import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { api } from "@/app/services/api";
import { useAuthStore } from "@/app/store/auth.store";

export function VerifyOtpForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const otpDigits = useMemo(() => otp.padEnd(6, " ").slice(0, 6).split(""), [otp]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/verify-otp", { phone, otp });
      const accessToken = response.data?.data?.accessToken;

      if (typeof accessToken === "string") {
        setAccessToken(accessToken);
      }

      setStatus(
        response.data?.message ??
          "OTP verified. The shared auth store is ready for protected routes."
      );
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
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+234 801 234 5678"
        required
      />

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">OTP code</label>
        <div className="grid grid-cols-6 gap-3">
          {otpDigits.map((digit, index) => (
            <div
              key={`${digit}-${index}`}
              className="flex h-14 items-center justify-center rounded-2xl border border-[var(--color-line)] bg-white text-lg font-semibold"
            >
              {digit.trim() || "•"}
            </div>
          ))}
        </div>
        <Input
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          required
          inputMode="numeric"
          maxLength={6}
        />
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-white p-4 text-sm leading-7 text-[var(--color-ink-muted)]">
        The OTP boxes above mirror the future polished experience while keeping
        the Phase 1 implementation simple and backend-ready.
      </div>

      {status ? (
        <p className="rounded-2xl bg-[#f1ede6] px-4 py-3 text-sm leading-7 text-[var(--color-brand-strong)]">
          {status}
        </p>
      ) : null}

      <Button type="submit" isLoading={isSubmitting}>
        Verify OTP
      </Button>
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