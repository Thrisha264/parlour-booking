import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    id: bigint;
    duration: bigint;
    name: string;
    description: string;
    price: bigint;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    date: string;
    createdAt: bigint;
    email: string;
    serviceId: bigint;
    phone: string;
    timeSlot: string;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(name: string, description: string, duration: bigint, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(customerName: string, phone: string, email: string, serviceId: bigint, date: string, timeSlot: string): Promise<bigint>;
    deleteService(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllServices(): Promise<Array<Service>>;
    getAvailableTimeSlots(serviceId: bigint, date: string): Promise<Array<string>>;
    getBooking(id: bigint): Promise<Booking>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getService(id: bigint): Promise<Service>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedServices(): Promise<void>;
    updateBookingStatus(bookingId: bigint, status: BookingStatus): Promise<void>;
    updateService(id: bigint, name: string, description: string, duration: bigint, price: bigint): Promise<void>;
}
