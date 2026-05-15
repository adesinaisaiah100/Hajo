import { BookingForm } from "@/app/components/customer/BookingForm";
import { getProviderProfile } from "@/app/services/marketplace.api";

export default async function BookProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderProfile(id);

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#14b8a6]">
          Booking request
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
          Book {provider.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Confirm the service, schedule, and location before the request moves into escrow.
        </p>
      </div>
      <BookingForm provider={provider} />
    </div>
  );
}
