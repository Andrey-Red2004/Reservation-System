import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Reservation } from '../types';
import { hasOverlapWithExisting } from '../utils/time';
import { bookingAPI } from '../services/api';

type BookingsContextValue = {
  bookings: Reservation[];
  loading: boolean;
  createBooking: (data: Omit<Reservation, 'id' | 'status'>) => Promise<{ ok: boolean; error?: string; booking?: Reservation }>;
  cancelBooking: (id: string) => Promise<{ ok: boolean; error?: string }>;
  updateBooking: (id: string, newData: Omit<Reservation, 'id' | 'status'>) => Promise<{ ok: boolean; error?: string }>;
  deleteBooking: (id: string) => Promise<void>;
  load: () => Promise<void>;
};

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await bookingAPI.getAll({ status: 'confirmed' });
      setBookings(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function createBooking(data: Omit<Reservation, 'id' | 'status'>): Promise<{ ok: boolean; error?: string; booking?: Reservation }> {
    // Validaciones frontend
    if (new Date(data.end) <= new Date(data.start)) {
      return { ok: false, error: 'Fin debe ser posterior al inicio.' };
    }

    // Verificar solapamientos con reservas existentes
    const tempBooking: Reservation = { 
      ...data, 
      id: 'temp', 
      status: 'pending' 
    };
    
    if (hasOverlapWithExisting(tempBooking, bookings)) {
      return { ok: false, error: 'El horario está ocupado.' };
    }

    try {
      const newBooking = await bookingAPI.create({
        userName: data.userName,
        userEmail: data.userEmail,
        start: data.start,
        end: data.end,
        notes: data.notes,
        resourceId: data.resourceId,
      });
      
      // Actualizar estado local
      setBookings(prev => [...prev, newBooking]);
      
      return { ok: true, booking: newBooking };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async function cancelBooking(id: string): Promise<{ ok: boolean; error?: string }> {
    try {
      await bookingAPI.cancel(id);
      
      // Actualizar estado local
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      ));
      
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async function updateBooking(id: string, newData: Omit<Reservation, 'id' | 'status'>): Promise<{ ok: boolean; error?: string }> {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newData.userEmail && !emailRegex.test(newData.userEmail)) {
      return { ok: false, error: 'Email inválido' };
    }

    // Validar nombre
    if (!newData.userName.trim()) {
      return { ok: false, error: 'El nombre no puede estar vacío' };
    }

    // Validar fechas
    if (new Date(newData.end) <= new Date(newData.start)) {
      return { ok: false, error: 'Fin debe ser posterior al inicio.' };
    }

    // Validar fecha pasada
    const selectedDate = new Date(newData.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { ok: false, error: 'No se pueden elegir fechas pasadas' };
    }

    // Validar anticipación de 1 hora
    const selectedDateTime = new Date(newData.start);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (selectedDateTime < oneHourFromNow) {
      return { ok: false, error: 'Las reservas deben hacerse con al menos 1 hora de anticipación' };
    }

    // Verificar solapamientos excluyendo la reserva actual
    const tempBooking: Reservation = { 
      ...newData, 
      id, 
      status: 'confirmed' 
    };
    
    if (hasOverlapWithExisting(tempBooking, bookings, id)) {
      return { ok: false, error: 'El horario está ocupado.' };
    }

    try {
      const updated = await bookingAPI.update(id, {
        userName: newData.userName,
        userEmail: newData.userEmail,
        start: newData.start,
        end: newData.end,
        notes: newData.notes,
      });
      
      // Actualizar estado local
      setBookings(prev => prev.map(b => 
        b.id === id ? updated : b
      ));
      
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async function deleteBooking(id: string): Promise<void> {
    try {
      await bookingAPI.delete(id);
      
      // Actualizar estado local
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      throw error;
    }
  }

  return (
    <BookingsContext.Provider value={{ bookings, loading, createBooking, cancelBooking, updateBooking, deleteBooking, load }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
}