// src/pages/BookingsPage.tsx
import { useState } from 'react';
import { makeSlotsForDay } from '../utils/time';
import { useBookings } from '../state/bookingsContext';
import NewBookingForm from '../components/NewBookingForm';
import EditBookingForm from '../components/EditBookingForm';
import BookingList from '../components/BookingList';
import type { Reservation } from '../types';

export default function BookingsPage() {
  const [date, setDate] = useState<string>(''); // Inicia vacío
  const [selectedSlot, setSelectedSlot] = useState<{start:string,end:string}|null>(null);
  const [editingBooking, setEditingBooking] = useState<Reservation | null>(null);
  const { bookings } = useBookings();
  
  const slots = date ? makeSlotsForDay(new Date(date)) : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reseervas</h1>
      
      {editingBooking && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
          <p className="font-semibold">Modificando reserva de: {editingBooking.userName}</p>
          <p className="text-sm">Seleccione una nueva fecha y hora para la cita</p>
          <button 
            onClick={() => { setEditingBooking(null); setSelectedSlot(null); setDate(''); }}
            className="mt-2 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Cancelar modificación
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2">
          <h2 className="text-lg font-semibold mb-2">Seleccione la fecha de su cita:</h2>
          </label>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {date && (
        <div className="border-2 border-gray-800 bg-white w-fit">
          <div className="bg-gray-200 border-b-2 border-gray-800 p-3">
            <h2 className="text-lg font-semibold">
              Seleccione la hora de su cita
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 150px)' }}>
            {slots.map((s, index) => {
              const startIso = s.start.toISOString();
              const endIso = s.end.toISOString();
              const occupied = bookings.some(b => b.status === 'confirmed' && b.start === startIso);
              
              const col = index % 3;
              const row = Math.floor(index / 3);
              
              return (
                <button 
                  key={startIso}
                  disabled={occupied}
                  onClick={() => setSelectedSlot({start: startIso, end: endIso})}
                  style={{
                    padding: '24px',
                    border: '1px solid #1f2937',
                    borderLeft: col === 0 ? '1px solid #1f2937' : '0',
                    borderTop: row === 0 ? '1px solid #1f2937' : '0',
                    backgroundColor: occupied ? '#ef233c' : 'white',//fecaca: rojo claro//
                    cursor: occupied ? 'not-allowed' : 'pointer',
                    color: occupied ? 'white' : '#000000'
                  }}
                  onMouseEnter={(e) => {
                    if (!occupied) e.currentTarget.style.backgroundColor = '#29bf12';
                  }}
                  onMouseLeave={(e) => {
                    if (!occupied) e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {s.start.toLocaleTimeString('es-CR', {hour: '2-digit', minute:'2-digit', hour12: false})}
                </button>
              );
            })}
          </div>

          {slots.length === 0 && (
            <h2 className="p-4 text-gray-500 italic font-semibold">No hay horas disponibles para este día.</h2>
          )}
        </div>
      )}

      {selectedSlot && !editingBooking && (
        <NewBookingForm slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      )}

      {selectedSlot && editingBooking && (
        <EditBookingForm 
          booking={editingBooking}
          slot={selectedSlot}
          onClose={() => {
            setSelectedSlot(null);
            setEditingBooking(null);
            setDate('');
          }}
        />
      )}

      {/* Lista de reservas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Mis Reservas</h2>
        <BookingList onEdit={(booking) => {
          setEditingBooking(booking);
          // Pre-seleccionar la fecha actual de la reserva
          const bookingDate = new Date(booking.start);
          setDate(bookingDate.toISOString().split('T')[0]);
        }} />
      </div>
    </div>
  );
}