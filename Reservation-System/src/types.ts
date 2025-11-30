export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export interface Reservation {
    id: String;
    userName: String;
    userEmail: String;
    start: String;
    end: String;
    status: BookingStatus;
    notes?: string;
    resourceId: String;
}