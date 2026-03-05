import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, BookingStatus, Service } from "../backend.d";
import { useActor } from "./useActor";

// ── Services ──────────────────────────────────────────────

export function useGetAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetService(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Service>({
    queryKey: ["service", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("Missing params");
      return actor.getService(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ── Bookings ──────────────────────────────────────────────

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      phone,
      email,
      serviceId,
      date,
      timeSlot,
    }: {
      customerName: string;
      phone: string;
      email: string;
      serviceId: bigint;
      date: string;
      timeSlot: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(
        customerName,
        phone,
        email,
        serviceId,
        date,
        timeSlot,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: bigint;
      status: BookingStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ── Time Slots ────────────────────────────────────────────

export function useGetAvailableTimeSlots(
  serviceId: bigint | null,
  date: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["timeSlots", serviceId?.toString(), date],
    queryFn: async () => {
      if (!actor || !serviceId || !date) return [];
      return actor.getAvailableTimeSlots(serviceId, date);
    },
    enabled: !!actor && !isFetching && !!serviceId && !!date,
  });
}

// ── Admin ─────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedServices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.seedServices();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      duration,
      price,
    }: {
      name: string;
      description: string;
      duration: bigint;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addService(name, description, duration, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// ── User Profile ──────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
