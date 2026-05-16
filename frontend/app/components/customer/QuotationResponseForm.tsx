'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QuotationResponseFormProps {
  quotation: {
    id: string;
    status: string;
    finalMaterialsCost?: number;
    finalLabourCost?: number;
    finalDescription?: string;
  };
  onAccept: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
  onNegotiate: (message: string, suggestedCost?: number) => Promise<void>;
  isLoading?: boolean;
}

export function QuotationResponseForm({
  quotation,
  onAccept,
  onReject,
  onNegotiate,
  isLoading = false,
}: QuotationResponseFormProps) {
  const [mode, setMode] = useState<'view' | 'negotiate' | 'reject'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [negotiateMessage, setNegotiateMessage] = useState('');
  const [suggestedCost, setSuggestedCost] = useState<number | undefined>();

  const materials = quotation.finalMaterialsCost || 0;
  const labour = quotation.finalLabourCost || 0;
  const total = materials + labour;

  const handleAccept = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onAccept();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onReject(rejectReason);
      setRejectReason('');
      setMode('view');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNegotiate = async () => {
    if (!negotiateMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onNegotiate(negotiateMessage, suggestedCost);
      setNegotiateMessage('');
      setSuggestedCost(undefined);
      setMode('view');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'view') {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation Summary</h3>

        {/* Quotation Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-start pb-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-600">Materials</p>
              <p className="text-lg font-semibold text-gray-900">₦{materials.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Released on acceptance</p>
              <p className="text-sm text-green-600 font-medium">Immediate</p>
            </div>
          </div>

          <div className="flex justify-between items-start pb-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-600">Labour</p>
              <p className="text-lg font-semibold text-gray-900">₦{labour.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Released on completion</p>
              <p className="text-sm text-amber-600 font-medium">After work</p>
            </div>
          </div>

          <div className="flex justify-between items-start pt-2">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {quotation.finalDescription && (
          <div className="bg-gray-50 rounded p-4 mb-6 border border-gray-100">
            <p className="text-sm text-gray-700">{quotation.finalDescription}</p>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">{error}</div>}

        {/* Action Buttons */}
        {quotation.status === 'SENT' || quotation.status === 'NEGOTIATING' ? (
          <div className="flex gap-3">
            <Button
              onClick={() => setMode('reject')}
              variant="secondary"
              disabled={isSubmitting || isLoading}
            >
              Reject
            </Button>
            <Button
              onClick={() => setMode('negotiate')}
              variant="secondary"
              disabled={isSubmitting || isLoading}
            >
              Negotiate
            </Button>
            <Button onClick={handleAccept} disabled={isSubmitting || isLoading} className="flex-1">
              {isSubmitting ? 'Processing...' : 'Accept Quotation'}
            </Button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
            This quotation has been {quotation.status.toLowerCase()}
          </div>
        )}
      </div>
    );
  }

  if (mode === 'reject') {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Quotation</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason (Optional)
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell the artisan why you're rejecting this quotation..."
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">{error}</div>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMode('view')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleReject} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'negotiate') {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Counter-Offer</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={negotiateMessage}
            onChange={(e) => setNegotiateMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What would you like to discuss or negotiate?"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="suggested-cost" className="block text-sm font-medium text-gray-700 mb-2">
            Suggested Total Cost (Optional)
          </label>
          <Input
            id="suggested-cost"
            type="number"
            step="100"
            min="0"
            value={suggestedCost || ''}
            onChange={(e) => setSuggestedCost(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Leave blank if you don't have a specific counter-offer"
          />
          <p className="text-xs text-gray-500 mt-1">Current total: ₦{total.toLocaleString()}</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">{error}</div>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setMode('view');
              setNegotiateMessage('');
              setSuggestedCost(undefined);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleNegotiate} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
