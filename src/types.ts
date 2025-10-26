// src/types.ts
export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export interface Reservation {
  id: string;
  userName: string;
  userEmail?: string;
  start: string; // ISO
  end: string;   // ISO
  status: BookingStatus;
  notes?: string;
  resourceId?: string;
}