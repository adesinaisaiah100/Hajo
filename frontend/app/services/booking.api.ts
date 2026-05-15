import {
  createMockBooking,
  getMockBooking,
  getMockBookings,
  updateMockBookingStatus,
  type BookingRecord,
} from "@/app/lib/mock-marketplace";
import { api } from "@/app/services/api";
import { useAuthStore } from "@/app/store/auth.store";

export async function listCustomerBookings() {
  const userId = useAuthStore.getState().user?.id;
  return getMockBookings("customer", userId);
}

export async function listProviderBookings() {
  const userId = useAuthStore.getState().user?.id;
  return getMockBookings("provider", userId);
}

export async function getBookingDetail(id: string) {
  return getMockBooking(id);
}

export async function createBooking(payload: {
  providerId: string;
  serviceId: string;
  amount: number;
  currency: string;
  scheduledAt: string;
  notes: string;
  location: string;
}): Promise<BookingRecord> {
  try {
    const response = await api.post("/bookings", payload);
    return response.data?.booking;
  } catch {
    return createMockBooking(payload);
  }
}

export async function acceptBooking(id: string) {
  try {
    const response = await api.put(`/bookings/${id}/accept`);
    return response.data?.booking;
  } catch {
    return updateMockBookingStatus(id, "ACCEPTED");
  }
}

export async function completeBooking(id: string) {
  try {
    const response = await api.put(`/bookings/${id}/complete`);
    return response.data?.booking;
  } catch {
    return updateMockBookingStatus(id, "COMPLETED");
  }
}

export async function cancelBooking(id: string, reason?: string) {
  try {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data?.booking;
  } catch {
    return updateMockBookingStatus(id, "CANCELLED");
  }
}
