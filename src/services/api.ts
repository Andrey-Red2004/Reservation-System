import type { Reservation } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Tipos para las respuestas del backend
export interface CreateBookingDTO {
  userName: string;
  userEmail?: string;
  start: string;
  end: string;
  notes?: string;
  resourceId?: string;
}

export interface UpdateBookingDTO {
  userName?: string;
  userEmail?: string;
  start?: string;
  end?: string;
  notes?: string;
  status?: 'confirmed' | 'cancelled' | 'pending';
}

// Servicio API
export const bookingAPI = {
  // Obtener todas las reservas
  async getAll(filters?: { status?: string; date?: string }): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    
    const url = `${API_BASE_URL}/bookings${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener reservas');
    }
    
    return response.json();
  },

  // Obtener una reserva por ID
  async getById(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    
    if (!response.ok) {
      throw new Error('Reserva no encontrada');
    }
    
    return response.json();
  },

  // Crear nueva reserva
  async create(data: CreateBookingDTO): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear reserva');
    }
    
    return response.json();
  },

  // Actualizar reserva
  async update(id: string, data: UpdateBookingDTO): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar reserva');
    }
    
    return response.json();
  },

  // Cancelar reserva (soft delete)
  async cancel(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al cancelar reserva');
    }
  },

  // Eliminar permanentemente
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}?hardDelete=true`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar reserva');
    }
  },
};
