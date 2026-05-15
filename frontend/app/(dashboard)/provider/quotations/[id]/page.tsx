'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { useQuotation, useSendQuotation } from '@/app/hooks/useQuotations';
import { QuotationReviewForm } from '@/app/components/provider/QuotationReviewForm';
import { NegotiationThread } from '@/app/components/shared/NegotiationThread';
import { Button } from '@/app/components/ui/Button';

export default function ProviderQuotationPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useQuotation(quotationId);
  const sendQuotation = useSendQuotation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verify user is authenticated and is a provider
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'PROVIDER') {
      router.push('/dashboard/customer');
      return;
    }

    setIsInitialized(true);
  }, [user, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading quotation...</div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">Failed to load quotation. Please try again.</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (quotation.status !== 'DRAFT' && quotation.status !== 'NEGOTIATING') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-amber-700">
              This quotation is no longer in draft status. Current status: {quotation.status}
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.back()} className="mb-4">
            ← Back to Bookings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Review Quotation</h1>
          <p className="text-gray-600 mt-1">Review the AI-generated quotation and make any adjustments before sending to the customer.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Form */}
          <div className="lg:col-span-2">
            <QuotationReviewForm
              quotation={quotation}
              isLoading={sendQuotation.isPending}
              onSubmit={async (data) => {
                await sendQuotation.mutateAsync({
                  quotationId,
                  finalMaterialsCost: data.finalMaterialsCost,
                  finalLabourCost: data.finalLabourCost,
                  description: data.description,
                });
                // Navigate to quotation view after sending
                setTimeout(() => {
                  router.push(`/dashboard/provider/bookings`);
                }, 1000);
              }}
            />
          </div>

          {/* Side Panel - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>

              {quotation.booking && (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">
                      {quotation.booking.customer.firstName} {quotation.booking.customer.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Service</p>
                    <p className="font-medium text-gray-900">{quotation.booking.service.title}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{quotation.status.toLowerCase()}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Split Escrow</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Materials (Now)</span>
                        <span className="font-medium text-green-600">Released immediately</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labour (Later)</span>
                        <span className="font-medium text-amber-600">On completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Negotiation Thread */}
        {quotation.status === 'NEGOTIATING' && quotation.messages && quotation.messages.length > 0 && (
          <div className="mt-6">
            <NegotiationThread
              messages={quotation.messages}
              currentUserRole="artisan"
              isPolling={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
