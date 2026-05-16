"use client";

import { Shield, HelpCircle, LogOut, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "@/app/store/toast.store";

export default function CustomerSettingsPage() {
  const { user, reset } = useAuthStore();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied", "Account number copied to clipboard.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Notifications */}
        <SectionCard title="Notifications">
          <div className="space-y-4">
            {[
              { id: "notif-1", title: "Booking Updates", description: "Get an SMS when an artisan responds to your request." },
              { id: "notif-2", title: "Payment Alerts", description: "Get notified when funds are released from escrow." },
              { id: "notif-3", title: "Security Alerts", description: "Important updates about your Hajo wallet." },
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

        {/* Account & Wallet */}
        <SectionCard title="Account & Wallet">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink-muted)]">Phone Number</p>
                <p className="font-medium text-[var(--foreground)]">{user?.phone || "+234 000 000 0000"}</p>
              </div>
            </div>
            {user?.squadAccountNo && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink-muted)]">Hajo Virtual Account (Squad)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--foreground)]">{user.squadAccountNo}</p>
                    <button 
                      onClick={() => handleCopy(user.squadAccountNo!)}
                      className="text-[var(--color-ink-muted)] hover:text-[var(--foreground)]"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Support */}
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

        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              reset();
              window.location.href = "/";
            }}
          >
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
