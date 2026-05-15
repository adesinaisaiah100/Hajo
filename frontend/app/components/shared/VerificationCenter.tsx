"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { SectionCard } from "./SectionCard";
import { Button } from "@/app/components/ui/Button";
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Users, 
  Fingerprint, 
  UserCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Tier1VerificationModal } from "./Tier1VerificationModal";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { api } from "@/app/services/api";
import { toast } from "@/app/store/toast.store";

export function VerificationCenter() {
  const { user, setUser } = useAuthStore();
  const [showTier1, setShowTier1] = useState(false);
  const [showTier2, setShowTier2] = useState(false);
  const [showTier3, setShowTier3] = useState(false);

  const tiers = [
    {
      id: "TIER_1",
      title: "Identity & Wallet",
      description: "Basic identity verification and creation of your Squad virtual account.",
      icon: ShieldCheck,
      status: getTierStatus("TIER_1", user?.verificationTier),
      features: ["Squad Virtual Account", "Booking Discovery", "Public Profile"],
      action: () => setShowTier1(true)
    },
    {
      id: "TIER_2",
      title: "Credentials & Location",
      description: "Advanced verification using NIN/BVN, detailed location, and emergency contacts.",
      icon: MapPin,
      status: getTierStatus("TIER_2", user?.verificationTier),
      features: ["Trust Badge", "Priority Search Ranking", "Higher Transaction Limits"],
      action: () => setShowTier2(true)
    },
    {
      id: "TIER_3",
      title: "Biometric Security",
      description: "Highest trust level with face scan and fingerprint matching.",
      icon: Fingerprint,
      status: getTierStatus("TIER_3", user?.verificationTier),
      features: ["Platinum Verified Badge", "Escrow Protection Priority", "Financial Service Eligibility"],
      action: () => setShowTier3(true)
    }
  ];

  function getTierStatus(tierId: string, currentTier?: string) {
    const tierOrder = ["TIER_0", "TIER_1", "TIER_2", "TIER_3"];
    const currentIndex = tierOrder.indexOf(currentTier || "TIER_0");
    const targetIndex = tierOrder.indexOf(tierId);

    if (currentIndex >= targetIndex) return "COMPLETED";
    if (currentIndex === targetIndex - 1) return "AVAILABLE";
    return "LOCKED";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#111827]">Trust Center</h1>
        <p className="text-sm text-[#6b7280]">
          Build your credibility on Hajo by completing tiered verification steps. 
          Higher tiers unlock more features and trust.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 transition-all duration-300",
              tier.status === "COMPLETED" ? "border-[#ccfbf1] bg-[#f0fdfa]" : 
              tier.status === "AVAILABLE" ? "border-[#e5e7eb] bg-white shadow-sm hover:shadow-md" :
              "border-[#f3f4f6] bg-gray-50 opacity-75"
            )}
          >
            <div className="flex items-start justify-between">
              <div className={cn(
                "rounded-2xl p-3",
                tier.status === "COMPLETED" ? "bg-[#ccfbf1] text-[#14b8a6]" : 
                tier.status === "AVAILABLE" ? "bg-[#f3f4f6] text-[#111827]" :
                "bg-[#f3f4f6] text-[#9ca3af]"
              )}>
                <tier.icon className="h-6 w-6" />
              </div>
              {tier.status === "COMPLETED" && (
                <div className="flex items-center gap-1 rounded-full bg-[#ccfbf1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0f766e]">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </div>
              )}
              {tier.status === "LOCKED" && (
                <Lock className="h-4 w-4 text-[#9ca3af]" />
              )}
            </div>

            <div className="mt-6 flex-1">
              <h3 className="text-lg font-bold text-[#111827]">{tier.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                {tier.description}
              </p>

              <div className="mt-6 space-y-3">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#374151]">
                    <div className="h-1 w-1 rounded-full bg-[#14b8a6]" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5">
              {tier.status === "AVAILABLE" ? (
                <Button className="w-full gap-2" onClick={tier.action}>
                  Complete Verification <ChevronRight className="h-4 w-4" />
                </Button>
              ) : tier.status === "COMPLETED" ? (
                <div className="text-center text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                  Step Completed
                </div>
              ) : (
                <div className="text-center text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                  Complete Previous Tiers First
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Tier1VerificationModal isOpen={showTier1} onClose={() => setShowTier1(false)} />
      <Tier2VerificationModal isOpen={showTier2} onClose={() => setShowTier2(false)} />
      <Tier3VerificationModal isOpen={showTier3} onClose={() => setShowTier3(false)} />
    </div>
  );
}

function Tier2VerificationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    nin: user?.nin || "",
    bvn: user?.bvn || "",
    city: user?.city || "",
    state: user?.state || "",
    nextOfKinName: user?.nextOfKinName || "",
    nextOfKinPhone: user?.nextOfKinPhone || "",
    nextOfKinRelation: user?.nextOfKinRelation || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/verify-tier-2", formData);
      const updatedUser = response.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("Tier 2 Verified!", "Your Advanced Trust Badge is now active.");
        onClose();
      }
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tier 2 Verification" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input 
            label="NIN (11 digits)" 
            value={formData.nin}
            maxLength={11}
            onChange={(e) => setFormData({...formData, nin: e.target.value})}
            required
          />
          <Input 
            label="BVN (11 digits)" 
            value={formData.bvn}
            maxLength={11}
            onChange={(e) => setFormData({...formData, bvn: e.target.value})}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input 
            label="Current City" 
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required
          />
          <Input 
            label="State" 
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            required
          />
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] p-5 space-y-4">
          <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Users className="h-4 w-4" /> Next of Kin Details
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input 
              label="Full Name" 
              className="sm:col-span-2"
              value={formData.nextOfKinName}
              onChange={(e) => setFormData({...formData, nextOfKinName: e.target.value})}
              required
            />
            <Input 
              label="Phone" 
              value={formData.nextOfKinPhone}
              onChange={(e) => setFormData({...formData, nextOfKinPhone: e.target.value})}
              required
            />
            <Input 
              label="Relation" 
              value={formData.nextOfKinRelation}
              onChange={(e) => setFormData({...formData, nextOfKinRelation: e.target.value})}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Submit Credentials
        </Button>
      </form>
    </Modal>
  );
}

function Tier3VerificationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanned, setScanned] = useState({ face: false, thumb: false });

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/verify-tier-3", {
        faceScanData: "mock_face_scan_result",
        fingerprintData: "mock_fingerprint_result"
      });
      const updatedUser = response.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("TIER 3 COMPLETED!", "You are now a Platinum Verified user.");
        onClose();
      }
    } catch (error: any) {
      toast.error("Error", "Biometric verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Biometric Security (Tier 3)">
      <div className="space-y-8 py-4">
        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={() => setScanned({...scanned, face: true})}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-8 transition",
              scanned.face ? "border-[#14b8a6] bg-[#f0fdfa] text-[#14b8a6]" : "border-[#e5e7eb] hover:border-[#14b8a6]"
            )}
          >
            <UserCheck className="h-10 w-10" />
            <span className="text-sm font-bold">Face Scan</span>
            {scanned.face && <span className="text-[10px] uppercase font-bold">Success</span>}
          </button>
          
          <button 
            onClick={() => setScanned({...scanned, thumb: true})}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-8 transition",
              scanned.thumb ? "border-[#14b8a6] bg-[#f0fdfa] text-[#14b8a6]" : "border-[#e5e7eb] hover:border-[#14b8a6]"
            )}
          >
            <Fingerprint className="h-10 w-10" />
            <span className="text-sm font-bold">Fingerprint</span>
            {scanned.thumb && <span className="text-[10px] uppercase font-bold">Success</span>}
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-[#fffbeb] p-4 border border-[#fef3c7]">
          <AlertCircle className="h-5 w-5 text-[#f59e0b] mt-0.5" />
          <p className="text-xs leading-5 text-[#92400e]">
            Ensure you are in a well-lit environment for the face scan. 
            Biometric data is encrypted and stored according to NDPR guidelines.
          </p>
        </div>

        <Button 
          className="w-full" 
          disabled={!scanned.face || !scanned.thumb} 
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Confirm Biometrics
        </Button>
      </div>
    </Modal>
  );
}
