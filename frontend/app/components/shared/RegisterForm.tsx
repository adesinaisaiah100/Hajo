"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/services/api";
import { useAuthStore, type UserRole } from "@/app/store/auth.store";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export function RegisterForm() {
  const [role, setRole] = useState<UserRole>("provider");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPendingRole = useAuthStore((state) => state.setRole);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/register", {
        fullName,
        phone,
        city,
        role,
      });

      setPendingRole(role);
      setStatus(
        response.data?.message ??
          "Registration request sent. Continue to OTP verification."
      );
    } catch (error) {
      setStatus(getErrorMessage(error, "Unable to register right now."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
          Select role
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              value: "provider" as const,
              title: "Service provider",
              body: "For workers who want discovery, safer payments, and a growing financial record.",
            },
            {
              value: "customer" as const,
              title: "Customer",
              body: "For people who want to search, book, and pay trusted local providers safely.",
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              className={`rounded-[1.5rem] border p-5 text-left transition ${
                role === option.value
                  ? "border-[var(--color-brand)] bg-[rgba(29,107,82,0.08)]"
                  : "border-[var(--color-line)] bg-white hover:border-[var(--color-brand)]/45"
              }`}
            >
              <p className="text-lg font-semibold">{option.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-ink-muted)]">
                {option.body}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Amina Yusuf"
          required
        />
        <Input
          label="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+234 801 234 5678"
          required
        />
      </div>

      <Input
        label="City"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Lagos"
        required
      />

      <div className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-[rgba(216,141,49,0.08)] p-4 text-sm leading-7 text-[var(--color-ink-muted)]">
        This Phase 1 screen is a starter shell for backend auth endpoints. Rich
        provider and customer onboarding forms land in later phases.
      </div>

      {status ? (
        <p className="rounded-2xl bg-[#f1ede6] px-4 py-3 text-sm leading-7 text-[var(--color-brand-strong)]">
          {status}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
        <Link
          href="/verify-otp"
          className="text-sm font-medium text-[var(--color-brand-strong)]"
        >
          Already have an OTP? Verify now
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