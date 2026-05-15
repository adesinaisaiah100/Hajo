"use client";

import { Bell, CreditCard, Shield, HelpCircle, AlertTriangle, LogOut, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { getMockWallet } from "@/app/lib/mock-marketplace";

export default function ProviderSettingsPage() {
  const wallet = getMockWallet("provider");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
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
              { id: "notif-4", title: "Platform updates (SMS)", description: "Occasional updates about SkillBridge features." },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-[#f3f4f6] pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-[#111827]">{item.title}</p>
                  <p className="text-sm text-[#6b7280]">{item.description}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#14b8a6] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ccfbf1]"></div>
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
                <p className="text-sm font-medium text-[#6b7280]">Phone Number</p>
                <p className="font-medium text-[#111827]">+234 801 234 5678</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280]">Squad Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#111827]">{wallet.virtualAccountNumber}</p>
                  <button className="text-[#6b7280] hover:text-[#111827]">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button className="text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Change linked bank account →
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Legal & Support */}
        <SectionCard title="Legal & Support">
          <div className="space-y-4">
            <button className="flex w-full items-center justify-between border-b border-[#f3f4f6] pb-4 text-left transition hover:text-[#14b8a6]">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#6b7280]" />
                <span className="font-medium text-[#111827]">Privacy Policy</span>
              </div>
              <span className="text-[#6b7280]">→</span>
            </button>
            <button className="flex w-full items-center justify-between border-b border-[#f3f4f6] pb-4 text-left transition hover:text-[#14b8a6]">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#6b7280]" />
                <span className="font-medium text-[#111827]">Terms of Service</span>
              </div>
              <span className="text-[#6b7280]">→</span>
            </button>
            <button className="flex w-full items-center justify-between text-left transition hover:text-[#14b8a6]">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-[#6b7280]" />
                <span className="font-medium text-[#111827]">Contact Support</span>
              </div>
              <span className="text-[#6b7280]">→</span>
            </button>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#111827]">Deactivate Account</p>
              <p className="text-sm text-[#6b7280]">This will hide your profile from customers.</p>
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
          <p className="mt-4 text-center text-xs text-[#9ca3af]">
            SkillBridge v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
