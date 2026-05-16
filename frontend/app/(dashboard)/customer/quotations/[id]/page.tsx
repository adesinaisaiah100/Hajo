'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { useQuotation, useAcceptQuotation, useRejectQuotation, useAddNegotiationMessage } from '@/app/hooks/useQuotations';
import { QuotationResponseForm } from '@/app/components/customer/QuotationResponseForm';
import { NegotiationThread } from '@/app/components/shared/NegotiationThread';
import { Button } from '@/app/components/ui/Button';

export default function CustomerQuotationPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useQuotation(quotationId);
  const acceptQuotation = useAcceptQuotation();
  const rejectQuotation = useRejectQuotation();
  const addNegotiationMessage = useAddNegotiationMessage();

  if (!user) {
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

  if (!quotation.finalMaterialsCost || !quotation.finalLabourCost) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-amber-700">The artisan hasn&apos;t sent a final quotation yet. Please check back later.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Quotation Response</h1>
          <p className="text-gray-600 mt-1">Review the quotation from the artisan and decide whether to accept, reject, or negotiate.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Form */}
          <div className="lg:col-span-2">
            <QuotationResponseForm
              quotation={quotation}
              onAccept={async () => {
                await acceptQuotation.mutateAsync(quotationId);
                setTimeout(() => {
                  router.push(`/dashboard/customer/bookings`);
                }, 1000);
              }}
              onReject={async (reason) => {
                await rejectQuotation.mutateAsync({ quotationId, reason });
                setTimeout(() => {
                  router.push(`/dashboard/customer/bookings`);
                }, 1000);
              }}
              onNegotiate={async (message, suggestedCost) => {
                await addNegotiationMessage.mutateAsync({
                  quotationId,
                  message,
                  suggestedCost,
                  senderRole: 'CUSTOMER',
                });
              }}
              isLoading={acceptQuotation.isPending || rejectQuotation.isPending}
            />
          </div>

          {/* Side Panel - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>

              {quotation.booking && (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600">Artisan</p>
                    <p className="font-medium text-gray-900">
                      {quotation.booking.provider.firstName} {quotation.booking.provider.lastName}
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
                    <p className="text-gray-600 mb-2">Payment Breakdown</p>
                    <div className="space-y-2 text-xs bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span>Materials (Now):</span>
                        <span className="font-medium">₦{quotation.finalMaterialsCost?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labour (Later):</span>
                        <span className="font-medium">₦{quotation.finalLabourCost?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-semibold">
                          ₦{((quotation.finalMaterialsCost || 0) + (quotation.finalLabourCost || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Negotiation Thread */}
        {quotation.messages && quotation.messages.length > 0 && (
          <div className="mt-6">
            <NegotiationThread
              messages={quotation.messages}
              currentUserRole="customer"
              isPolling={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
