"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import { useAuthStore, type UserRole } from "@/app/store/auth.store";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { toast } from "@/app/store/toast.store";
export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role");
  const [role, setRole] = useState<UserRole>(
    paramRole === "customer" ? "customer" : "provider"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPendingRole = useAuthStore((state) => state.setRole);

  // role is derived from URL params at init to avoid an extra render cycle

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        phone,
        role: role?.toUpperCase(),
      });

      const otp = response.data?.data?.otp;
      if (otp) {
        toast.success("Verification Code", `Your Hajo code is ${otp}`);
      }

      setPendingRole(role);
      
      // Auto redirect to verify page after small delay to show toast
      setTimeout(() => {
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      }, 1500);

      setStatus(
        response.data?.message ??
          "Registration request sent. Redirecting to verification..."
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
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">Who are you?</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              value: "provider" as const,
              title: "Service provider",
              body: "Build a verified profile, receive escrowed payments, and grow your reputation.",
            },
            {
              value: "customer" as const,
              title: "Customer",
              body: "Find skilled local providers, book with confidence, and pay on completion.",
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              className={`rounded-lg border-2 p-5 text-left transition ${
                role === option.value
                  ? "border-[var(--color-brand)] bg-[var(--color-surface)] shadow-sm"
                  : "border-[var(--color-line)] bg-white hover:border-[var(--color-brand)]"
              }`}
            >
              <p className="text-lg font-bold text-[var(--foreground)]">{option.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-ink-muted)]">{option.body}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="John"
          required
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Doe"
          required
        />
      </div>

      <Input
        label="Phone number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+234 801 234 5678"
        required
      />

      {status ? (
        <p className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-line)] px-4 py-3 text-sm leading-7 text-[var(--color-ink-muted)] font-medium">
          {status}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
        <Link href="/verify-otp" className="text-sm font-semibold text-[var(--color-brand)] transition hover:text-[var(--color-brand-strong)]">
          Have an OTP? Verify
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
