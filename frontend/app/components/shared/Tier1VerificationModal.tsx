"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { api } from "@/app/services/api";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { toast } from "@/app/store/toast.store";
import { ShieldCheck, UserCheck } from "lucide-react";

interface Tier1VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Tier1VerificationModal({ isOpen, onClose }: Tier1VerificationModalProps) {
  const { user, setUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/verify-tier-1", {
        firstName,
        lastName,
        email,
      });

      const updatedUser = response.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
        toast.success(
          "Tier 1 Verified!", 
          `Your virtual account ${updatedUser.squadAccountNo} is now active.`
        );
        onClose();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed. Please try again.";
      toast.error("Verification Error", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Tier 1 Verification">
      <div className="mb-6 flex items-start gap-4 rounded-2xl bg-[#f0fdfa] p-5 border border-[#ccfbf1]">
        <div className="rounded-full bg-[#ccfbf1] p-2 text-[#14b8a6]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">Build your reputation</h4>
          <p className="mt-1 text-xs leading-5 text-[#6b7280]">
            Providing your legal name and email allows us to create a 
            <strong> real virtual account</strong> for you via Squad API.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Samuel"
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Ade"
          />
        </div>
        
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="samuel.ade@example.com"
        />

        <div className="pt-2">
          <Button type="submit" className="w-full gap-2" isLoading={isSubmitting}>
            <UserCheck className="h-4 w-4" />
            Verify & Create Account
          </Button>
          <p className="mt-4 text-center text-[10px] text-[#9ca3af]">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Your data is processed securely via Squad API (Sandbox).
          </p>
        </div>
      </form>
    </Modal>
  );
}
