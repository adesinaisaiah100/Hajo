'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const schema = z.object({
  finalMaterialsCost: z.number().positive('Materials cost must be positive'),
  finalLabourCost: z.number().positive('Labour cost must be positive'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface QuotationReviewFormProps {
  quotation: {
    draftMaterialsCost: number;
    draftLabourCost: number;
    draftDescription: string;
  };
  isLoading?: boolean;
  onSubmit: (data: FormData) => Promise<void>;
}

export function QuotationReviewForm({ quotation, isLoading = false, onSubmit }: QuotationReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      finalMaterialsCost: quotation.draftMaterialsCost,
      finalLabourCost: quotation.draftLabourCost,
      description: quotation.draftDescription,
    },
  });

  const materialsWatch = watch('finalMaterialsCost'); // eslint-disable-line react-hooks/incompatible-library
  const labourWatch = watch('finalLabourCost');
  const total = (materialsWatch || 0) + (labourWatch || 0);

  const handleFormSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Draft Quotation</h3>

        {/* Materials Cost */}
        <div className="mb-6">
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
            Materials Cost (NGN)
          </label>
          <Input
            id="materials"
            type="number"
            step="100"
            min="0"
            {...register('finalMaterialsCost', { valueAsNumber: true })}
            className="w-full"
            placeholder="0"
          />
          {errors.finalMaterialsCost && (
            <p className="text-sm text-red-600 mt-1">{errors.finalMaterialsCost.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Original draft: ₦{quotation.draftMaterialsCost?.toLocaleString()}</p>
        </div>

        {/* Labour Cost */}
        <div className="mb-6">
          <label htmlFor="labour" className="block text-sm font-medium text-gray-700 mb-2">
            Labour Cost (NGN)
          </label>
          <Input
            id="labour"
            type="number"
            step="100"
            min="0"
            {...register('finalLabourCost', { valueAsNumber: true })}
            className="w-full"
            placeholder="0"
          />
          {errors.finalLabourCost && (
            <p className="text-sm text-red-600 mt-1">{errors.finalLabourCost.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Original draft: ₦{quotation.draftLabourCost?.toLocaleString()}</p>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-gray-50 rounded p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Materials</p>
              <p className="text-lg font-semibold text-gray-900">₦{(materialsWatch || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Labour</p>
              <p className="text-lg font-semibold text-gray-900">₦{(labourWatch || 0).toLocaleString()}</p>
            </div>
            <div className="col-span-2 border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's included in this quotation?"
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">{error}</div>}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting || isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
            {isSubmitting ? 'Sending...' : 'Send to Customer'}
          </Button>
        </div>
      </div>
    </form>
  );
}
