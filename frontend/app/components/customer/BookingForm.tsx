"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type { ProviderProfile } from "@/app/lib/mock-marketplace";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { PaymentSummary } from "@/app/components/shared/PaymentSummary";
import { useCreateBooking } from "@/app/hooks/useBookings";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "@/app/store/toast.store";
import { AlertCircle } from "lucide-react";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Select a service"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  location: z.string().min(3, "Enter the service location"),
  notes: z.string().min(10, "Add a short job description"),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm({ provider }: { provider: ProviderProfile }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const mutation = useCreateBooking();
  const firstService = provider.services[0];
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: firstService?.id ?? "",
      date: "",
      time: "",
      location: `${provider.area}, ${provider.city}`,
      notes: "",
    },
  });
  const selectedServiceId = useWatch({
    control: form.control,
    name: "serviceId",
  });

  const selectedService =
    provider.services.find((service) => service.id === selectedServiceId) ?? firstService;

  async function onSubmit(values: BookingValues) {
    // Check if user has virtual account (verified)
    if (!user?.squadAccountNo) {
      toast.warning(
        "Verification Required",
        "You need to create a virtual account to make bookings. Complete your Tier 1 verification to continue.",
        {
          label: "Verify Now →",
          onClick: () => router.push("/customer/verification?start=tier1"),
        }
      );
      // Navigate to verification page after a short delay
      setTimeout(() => {
        router.push("/customer/verification?start=tier1");
      }, 1500);
      return;
    }

    const scheduledAt = new Date(`${values.date}T${values.time}:00`).toISOString();
    const booking = await mutation.mutateAsync({
      providerId: provider.id,
      serviceId: values.serviceId,
      amount: selectedService.price,
      currency: selectedService.currency,
      scheduledAt,
      notes: values.notes,
      location: values.location,
    });

    router.push(`/customer/bookings/${booking.id}?created=1`);
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[#374151]">Service</span>
            <select
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#14b8a6] focus:ring-2 focus:ring-[rgba(20,184,166,0.18)]"
              {...form.register("serviceId")}
            >
              {provider.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
            <span className="text-sm text-[#6b7280]">{selectedService.description}</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Preferred date"
              type="date"
              error={form.formState.errors.date?.message}
              {...form.register("date")}
            />
            <Input
              label="Preferred time"
              type="time"
              error={form.formState.errors.time?.message}
              {...form.register("time")}
            />
          </div>

          <Input
            label="Service location"
            error={form.formState.errors.location?.message}
            {...form.register("location")}
          />

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#374151]">Job description</span>
            <textarea
              rows={5}
              className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#14b8a6] focus:ring-2 focus:ring-[rgba(20,184,166,0.18)]"
              placeholder="Describe the job, urgency, and any access instructions."
              {...form.register("notes")}
            />
            {form.formState.errors.notes?.message ? (
              <span className="text-sm text-[#dc2626]">{form.formState.errors.notes.message}</span>
            ) : null}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <PaymentSummary amount={selectedService.price} currency={selectedService.currency}>
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 text-sm text-[#6b7280]">
            The amount is held in escrow and only released when the booking is completed.
          </div>
        </PaymentSummary>

        <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[#111827]">Before you confirm</h3>
          {!user?.squadAccountNo && (
            <div className="mt-4 rounded-2xl border border-[#fca5a5] bg-[#fef2f2] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#dc2626] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#991b1b]">Verification required</p>
                  <p className="mt-1 text-sm text-[#7f1d1d]">
                    You need to complete Tier 1 verification to create a virtual account and make bookings.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/customer/verification?start=tier1")}
                    className="mt-3 text-sm font-semibold text-[#dc2626] hover:text-[#991b1b] underline"
                  >
                    Go to Trust Center →
                  </button>
                </div>
              </div>
            </div>
          )}
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6b7280]">
            <li>Confirm the provider can access the location at the selected time.</li>
            <li>Use the notes field for gate codes, landmarks, or urgent context.</li>
            <li>Wallet and escrow updates will reflect on your booking detail page.</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Button type="submit" className="flex-1" isLoading={mutation.isPending}>
              Request booking
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
