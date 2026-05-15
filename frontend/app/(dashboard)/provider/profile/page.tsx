"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, ExternalLink, Save } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { SectionCard } from "@/app/components/shared/SectionCard";
import { useAuthStore } from "@/app/store/auth.store";
import { getMockProvider } from "@/app/lib/mock-marketplace";

export default function ProviderProfilePage() {
  const user = useAuthStore((state) => state.user);
  const providerId = user?.provider?.id || "prov-1";
  
  const { data: provider } = useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => getMockProvider(providerId),
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Edit Profile</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Update your business details and personal information.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a href={`/providers/${providerId}`} target="_blank" rel="noopener noreferrer">
              <span>Preview Profile</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button 
            className="flex items-center gap-2" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Photo */}
          <SectionCard title="Profile Photo">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af] overflow-hidden">
                <Camera className="h-8 w-8" />
              </div>
              <div>
                <Button variant="outline">Change Photo</Button>
                <p className="mt-2 text-xs text-[#6b7280]">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Personal Info */}
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Full Name</label>
                <Input defaultValue={provider?.name} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Phone Number</label>
                <Input defaultValue="+234 801 234 5678" disabled className="bg-gray-50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">State</label>
                <Input defaultValue={provider?.city} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">LGA / Area</label>
                <Input defaultValue={provider?.area} />
              </div>
            </div>
          </SectionCard>

          {/* Trade Info */}
          <SectionCard title="Trade Details">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Trade Name</label>
                <Input defaultValue={provider?.tradeName} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Category</label>
                <select className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base shadow-sm focus:border-[#14b8a6] focus:outline-none focus:ring-1 focus:ring-[#14b8a6]">
                  <option>{provider?.category}</option>
                  <option>Plumber</option>
                  <option>Tailor</option>
                  <option>Carpenter</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Years of Experience</label>
                <Input type="number" defaultValue="5" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-[#374151]">Bio</label>
                <textarea 
                  className="flex w-full rounded-lg border border-gray-300 bg-white p-4 text-base shadow-sm focus:border-[#14b8a6] focus:outline-none focus:ring-1 focus:ring-[#14b8a6] min-h-[100px]"
                  defaultValue={provider?.bio}
                ></textarea>
                <p className="text-xs text-[#6b7280] text-right">0 / 300</p>
              </div>
            </div>
          </SectionCard>

          {/* Pricing */}
          <SectionCard title="Pricing Range">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Minimum Price (₦)</label>
                <Input type="number" defaultValue={provider?.priceFrom} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Maximum Price (₦)</label>
                <Input type="number" defaultValue={provider?.priceTo} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Identity */}
          <SectionCard title="Identity">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">NIN (Optional)</label>
                <Input placeholder="Enter your 11-digit NIN" />
                <p className="text-xs text-[#6b7280]">
                  Adding your NIN helps build your trust score faster.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Availability */}
          <SectionCard title="Availability">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827]">Accepting bookings</p>
                <p className="text-xs text-[#6b7280]">Turn off to hide your profile from search</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#14b8a6] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ccfbf1]"></div>
              </label>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
