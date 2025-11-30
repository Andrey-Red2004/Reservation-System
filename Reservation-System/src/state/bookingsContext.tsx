// src/state/bookingsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Reservation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { hasOverlapWithExisting } from '../utils/time';

type BookingsContextValue = {
  bookings: Reservation[];
  createBooking: (data: Omit<Reservation, 'id' | 'status'>) => { ok: boolean; error?: string; booking?: Reservation };
  deleteBooking: (id: string) => void;
  load: () => void;
};

const STORAGE_KEY = 'poc_bookings_v1';
const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Reservation[]>([]);

  useEffect(() => { load(); }, []);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setBookings(raw ? JSON.parse(raw) : []);
    } catch {
      setBookings([]);
    }
  }

  function persist(list: Reservation[]) {
    setBookings(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function createBooking(data: Omit<Reservation, 'id' | 'status'>) {
  const booking: Reservation = { ...data, id: uuidv4(), status: 'confirmed' };

  if (new Date(booking.end) <= new Date(booking.start)) {
    return { ok: false, error: 'Fin debe ser posterior al inicio.' };
  }

  // Aquí usamos el estado actual dentro del setState
  if (hasOverlapWithExisting(booking, bookings)) {
    return { ok: false, error: 'El horario está ocupado.' };
  }

  setBookings(prev => {
    const next = [...prev, booking];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  });

  return { ok: true, booking };
}

  function deleteBooking(id: string) {
    const next = bookings.filter(b => b.id !== id);
    persist(next);
  }

  return (
    <BookingsContext.Provider value={{ bookings, createBooking, deleteBooking, load }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
}
