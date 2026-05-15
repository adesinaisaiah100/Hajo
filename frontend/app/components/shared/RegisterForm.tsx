"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import { useAuthStore, type UserRole } from "@/app/store/auth.store";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { toast } from "@/app/store/toast.store";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("provider");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPendingRole = useAuthStore((state) => state.setRole);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await api.post("/auth/register", {
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
        <p className="text-sm font-semibold uppercase tracking-wider text-[#14b8a6]">
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
              className={`rounded-lg border-2 p-5 text-left transition ${
                role === option.value
                  ? "border-[#14b8a6] bg-[#f0fdfa]"
                  : "border-[#e5e7eb] bg-white hover:border-[#14b8a6]"
              }`}
            >
              <p className="text-lg font-bold text-[#111827]">{option.title}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b7280]">
                {option.body}
              </p>
            </button>
          ))}
        </div>
      </div>

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
          Create account
        </Button>
        <Link
          href="/verify-otp"
          className="text-sm font-semibold text-[#14b8a6] transition hover:text-[#0d9488]"
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
