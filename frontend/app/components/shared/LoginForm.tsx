"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export function LoginForm() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/login", { phone });
      setStatus(
        response.data?.message ?? "OTP sent. Continue to verification to sign in."
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

      <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[#f6f1e8] p-4 text-sm leading-7 text-[var(--color-ink-muted)]">
        Login is passwordless. The backend can issue an OTP and keep the access
        token flow consistent with the shared API client.
      </div>

      {status ? (
        <p className="rounded-2xl bg-[#f1ede6] px-4 py-3 text-sm leading-7 text-[var(--color-brand-strong)]">
          {status}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" isLoading={isSubmitting}>
          Send OTP
        </Button>
        <Link
          href="/verify-otp"
          className="text-sm font-medium text-[var(--color-brand-strong)]"
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