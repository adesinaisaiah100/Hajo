'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as quotationsApi from '../services/quotations.api';

const QUOTATION_QUERY_KEY = 'quotations';
const POLLING_INTERVAL = 4000; // 4 seconds (matches backend config)

/**
 * Hook to fetch and poll quotation with messages
 */
export function useQuotation(quotationId: string | null, pollInterval = POLLING_INTERVAL) {
  return useQuery({
    queryKey: [QUOTATION_QUERY_KEY, quotationId],
    queryFn: () => quotationsApi.getQuotation(quotationId!),
    enabled: !!quotationId,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    staleTime: 1000, // Consider data stale after 1 second (encourage frequent polls)
  });
}

/**
 * Hook to generate a draft quotation
 */
export function useGenerateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => quotationsApi.generateQuotation(bookingId),
    onSuccess: (data) => {
      // Cache the new quotation
      queryClient.setQueryData([QUOTATION_QUERY_KEY, data.id], data);
    },
  });
}

/**
 * Hook to send quotation
 */
export function useSendQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      finalMaterialsCost,
      finalLabourCost,
      description,
    }: {
      quotationId: string;
      finalMaterialsCost: number;
      finalLabourCost: number;
      description?: string;
    }) =>
      quotationsApi.sendQuotation(
        quotationId,
        finalMaterialsCost,
        finalLabourCost,
        description
      ),
    onSuccess: (data) => {
      queryClient.setQueryData([QUOTATION_QUERY_KEY, data.id], data);
    },
  });
}

/**
 * Hook to accept quotation
 */
export function useAcceptQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quotationId: string) => quotationsApi.acceptQuotation(quotationId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUOTATION_QUERY_KEY, data.id], data);
    },
  });
}

/**
 * Hook to reject quotation
 */
export function useRejectQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, reason }: { quotationId: string; reason?: string }) =>
      quotationsApi.rejectQuotation(quotationId, reason),
    onSuccess: (data) => {
      queryClient.setQueryData([QUOTATION_QUERY_KEY, data.id], data);
    },
  });
}

/**
 * Hook to add negotiation message
 */
export function useAddNegotiationMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      message,
      suggestedCost,
      senderRole,
    }: {
      quotationId: string;
      message: string;
      suggestedCost?: number;
      senderRole?: string;
    }) =>
      quotationsApi.addNegotiationMessage(quotationId, message, suggestedCost, senderRole),
    onSuccess: (data, variables) => {
      // Refetch quotation to get updated message thread
      queryClient.invalidateQueries({ queryKey: [QUOTATION_QUERY_KEY, variables.quotationId] });
    },
  });
}

/**
 * Hook to negotiate quotation (shorthand)
 */
export function useNegotiateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      message,
      suggestedCost,
      senderRole,
    }: {
      quotationId: string;
      message: string;
      suggestedCost?: number;
      senderRole?: string;
    }) =>
      quotationsApi.negotiateQuotation(quotationId, message, suggestedCost, senderRole),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUOTATION_QUERY_KEY, variables.quotationId] });
    },
  });
}
