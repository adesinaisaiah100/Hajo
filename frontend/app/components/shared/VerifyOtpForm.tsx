"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { api } from "@/app/services/api";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "@/app/store/toast.store";

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAccessToken, setUser } = useAuthStore();
  const otpDigits = useMemo(() => otp.padEnd(6, " ").slice(0, 6).split(""), [otp]);

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    if (phoneParam) {
      setPhone(phoneParam);
    }
  }, [searchParams]);

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
        useAuthStore.getState().setRole(user.role.toLowerCase() as any);
        
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
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+234 801 234 5678"
        required
      />

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[#111827]">OTP code</label>
        <div className="grid grid-cols-6 gap-3">
          {otpDigits.map((digit, index) => (
            <div
              key={`${digit}-${index}`}
              className="flex h-14 items-center justify-center rounded-lg border-2 border-[#e5e7eb] bg-white text-lg font-bold text-[#111827]"
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

      {status ? (
        <p className="rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3 text-sm leading-7 text-[#047857] font-medium">
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