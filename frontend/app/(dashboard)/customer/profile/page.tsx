"use client";

import { useState } from "react";
import { CheckCircle2, Copy, PencilLine, Save, User } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "@/app/store/toast.store";

export default function CustomerProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    state: user?.state || "",
    lga: user?.city || "",
  });

  const accountNumber = user?.squadAccountNo || "0123456789";
  const accountName = `${user?.firstName || "Amaka"} ${user?.lastName || "Obi"} - Hajo`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    toast.success("Copied", "Account number copied to clipboard.");
  };

  const handleSave = () => {
    setIsSaving(true);
    const [firstName, ...rest] = formData.fullName.trim().split(" ");
    const lastName = rest.join(" ");
    setUser({ ...user, firstName, lastName, state: formData.state, city: formData.lga });
    setIsSaving(false);
    toast.success("Profile Updated", "Your personal details have been saved.");
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] sm:mx-0">
            <User className="h-10 w-10 text-[var(--color-ink-muted)]" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">{formData.fullName || "Customer profile"}</h1>
        </div>
        <Button variant="secondary" className="gap-2">
          <PencilLine className="h-4 w-4" />
          Edit profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SectionCard title="Personal details">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)]">Full name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)]">Phone number</label>
                <Input value={user?.phone || ""} disabled className="bg-[var(--color-surface)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)]">State</label>
                <select
                  value={formData.state}
                  onChange={(event) => setFormData({ ...formData, state: event.target.value })}
                  className="h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-brand)]"
                >
                  <option value="">Select state</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Oyo">Oyo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)]">LGA</label>
                <select
                  value={formData.lga}
                  onChange={(event) => setFormData({ ...formData, lga: event.target.value })}
                  className="h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-brand)]"
                >
                  <option value="">Select LGA</option>
                  <option value="Yaba">Yaba</option>
                  <option value="Lekki">Lekki</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Surulere">Surulere</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Profile photo">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--color-ink-muted)]">Upload a clear profile photo. Max size: 2MB.</p>
              <Button variant="secondary">Change photo</Button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Account info">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
                <span className="text-[var(--color-ink-muted)]">Hajo account number</span>
                <div className="inline-flex items-center gap-2 font-semibold text-[var(--foreground)]">
                  {accountNumber}
                  <button type="button" onClick={handleCopy} className="rounded p-1 hover:bg-white" aria-label="Copy account number">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
                <span className="text-[var(--color-ink-muted)]">Bank name</span>
                <span className="font-semibold text-[var(--foreground)]">Wema Bank</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
                <span className="text-[var(--color-ink-muted)]">Account name</span>
                <span className="font-semibold text-[var(--foreground)]">{accountName}</span>
              </div>
              <p className="pt-1 text-xs text-[var(--color-ink-muted)]">This is your wallet funding account number.</p>
            </div>
          </SectionCard>

          <SectionCard title="Verification status">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-[#ecfdf5] px-3 py-2 text-[#047857]">
                <span className="inline-flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Phone verified
                </span>
                <span className="font-semibold">Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
                <span className="text-[var(--color-ink-muted)]">NIN verification</span>
                <a href="/customer/verification" className="font-semibold text-[var(--color-brand)]">
                  Verify NIN
                </a>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-[var(--color-line)] bg-white/95 p-3 backdrop-blur-sm lg:bottom-0 lg:left-[260px]">
        <div className="mx-auto flex w-full max-w-7xl justify-end">
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
