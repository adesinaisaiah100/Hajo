"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { useAuthStore } from "@/app/store/auth.store";
import { getMockProvider } from "@/app/lib/mock-marketplace";

export default function ProviderServicesPage() {
  const user = useAuthStore((state) => state.user);
  const providerId = user?.provider?.id || "prov-1";
  
  const { data: provider } = useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => getMockProvider(providerId),
  });

  const services = provider?.services || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">My Services</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Manage the services you offer to customers.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{service.title}</h3>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-ink-muted)]">
                    {service.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{service.description}</p>
                <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[var(--foreground)]">
                  <span>₦{service.price.toLocaleString()}</span>
                  <span className="text-[var(--color-line)]">|</span>
                  <span className="text-[var(--color-success)] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-9 w-9 p-0" title="Edit">
                  <Edit className="h-4 w-4 text-[var(--color-ink-muted)]" />
                </Button>
                <Button variant="outline" className="h-9 w-9 p-0 hover:border-red-200 hover:text-red-600" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services added yet"
          description="Add a service to start getting bookings."
          action={
            <Button className="mt-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add your first service</span>
            </Button>
          }
        />
      )}
    </div>
  );
}
