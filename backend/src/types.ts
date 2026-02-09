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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationDTO {
  userName: string;
  userEmail?: string;
  start: string;
  end: string;
  notes?: string;
  resourceId?: string;
}

export interface UpdateReservationDTO {
  userName?: string;
  userEmail?: string;
  start?: string;
  end?: string;
  notes?: string;
  status?: BookingStatus;
}
