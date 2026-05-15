"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  createBooking,
  getBookingDetail,
  listCustomerBookings,
  listProviderBookings,
} from "@/app/services/booking.api";

export function useCustomerBookings() {
  return useQuery({
    queryKey: ["customer-bookings"],
    queryFn: listCustomerBookings,
  });
}

export function useProviderBookings() {
  return useQuery({
    queryKey: ["provider-bookings"],
    queryFn: listProviderBookings,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking-detail", id],
    queryFn: () => getBookingDetail(id),
    enabled: Boolean(id),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet", "customer"] });
    },
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["booking-detail", bookingId] });
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeBooking,
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["booking-detail", bookingId] });
      void queryClient.invalidateQueries({ queryKey: ["wallet", "provider"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, reason),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["booking-detail", variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["wallet", "customer"] });
    },
  });
}
