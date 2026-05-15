"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { toast } from "@/app/store/toast.store";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/login", { phone });
      
      const otp = response.data?.data?.otp;
      if (otp) {
        toast.success("Verification Code", `Your Hajo code is ${otp}`);
      }

      // Auto redirect after delay
      setTimeout(() => {
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      }, 1500);

      setStatus(
        response.data?.message ?? "OTP sent. Redirecting to verification..."
      );
    } catch (error) {
      setStatus(getErrorMessage(error, "Unable to start login right now."));
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

      {status ? (
        <p className="rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3 text-sm leading-7 text-[#047857] font-medium">
          {status}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" isLoading={isSubmitting}>
          Send OTP
        </Button>
        <Link
          href="/verify-otp"
          className="text-sm font-semibold text-[#14b8a6] transition hover:text-[#0d9488]"
        >
          Go to OTP verification
        </Link>
      </div>
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