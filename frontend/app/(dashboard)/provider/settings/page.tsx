"use client";

import { CreditCard, Shield, HelpCircle, LogOut, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { getMockWallet } from "@/app/lib/mock-marketplace";

export default function ProviderSettingsPage() {
  const wallet = getMockWallet("provider");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Manage your account preferences and notifications.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Notifications */}
        <SectionCard title="Notifications">
          <div className="space-y-4">
            {[
              { id: "notif-1", title: "New booking request (SMS)", description: "Get an SMS when a customer requests your service." },
              { id: "notif-2", title: "Booking accepted (SMS)", description: "Get an SMS when a booking is officially accepted." },
              { id: "notif-3", title: "Payment received (SMS)", description: "Get an SMS when funds are released to your wallet." },
              { id: "notif-4", title: "Platform updates (SMS)", description: "Occasional updates about Hajo features." },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-[var(--color-line)] pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{item.title}</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">{item.description}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--color-brand)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d1fae5]"></div>
                </label>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Account */}
        <SectionCard title="Account">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink-muted)]">Phone Number</p>
                <p className="font-medium text-[var(--foreground)]">+234 801 234 5678</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink-muted)]">Squad Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[var(--foreground)]">{wallet.virtualAccountNumber}</p>
                  <button className="text-[var(--color-ink-muted)] hover:text-[var(--foreground)]">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button className="text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-strong)] transition-colors flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Change linked bank account →
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Legal & Support */}
        <SectionCard title="Legal & Support">
          <div className="space-y-4">
            <button className="flex w-full items-center justify-between border-b border-[var(--color-line)] pb-4 text-left transition hover:text-[var(--color-brand)]">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[var(--color-ink-muted)]" />
                <span className="font-medium text-[var(--foreground)]">Privacy Policy</span>
              </div>
              <span className="text-[var(--color-ink-muted)]">→</span>
            </button>
            <button className="flex w-full items-center justify-between border-b border-[var(--color-line)] pb-4 text-left transition hover:text-[var(--color-brand)]">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[var(--color-ink-muted)]" />
                <span className="font-medium text-[var(--foreground)]">Terms of Service</span>
              </div>
              <span className="text-[var(--color-ink-muted)]">→</span>
            </button>
            <button className="flex w-full items-center justify-between text-left transition hover:text-[var(--color-brand)]">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-[var(--color-ink-muted)]" />
                <span className="font-medium text-[var(--foreground)]">Contact Support</span>
              </div>
              <span className="text-[var(--color-ink-muted)]">→</span>
            </button>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--foreground)]">Deactivate Account</p>
              <p className="text-sm text-[var(--color-ink-muted)]">This will hide your profile from customers.</p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
              Deactivate
            </Button>
          </div>
        </SectionCard>

        <div className="pt-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
          <p className="mt-4 text-center text-xs text-[var(--color-ink-muted)]">
            Hajo v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
