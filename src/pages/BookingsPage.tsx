// src/pages/BookingsPage.tsx
import React, { useState } from 'react';
import { makeSlotsForDay } from '../utils/time';
import { useBookings } from '../state/bookingsContext';
import NewBookingForm from '../components/NewBookingForm';

export default function BookingsPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10)); // yyyy-mm-dd
  const [selectedSlot, setSelectedSlot] = useState<{start:string,end:string}|null>(null);
  const { bookings } = useBookings();
  const day = new Date(date);
  const slots = makeSlotsForDay(day);

  return (
    <div className="p-4">
      <h2>Reservas</h2>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {slots.map(s => {
          const startIso = s.start.toISOString();
          const endIso = s.end.toISOString();
          const occupied = bookings.some(b => b.status === 'confirmed' && b.start === startIso);
          return (
            <button key={startIso}
              disabled={occupied}
              onClick={() => setSelectedSlot({start: startIso, end: endIso})}
              className={`p-2 border ${occupied ? 'bg-red-200' : 'bg-green-100'}`}>
              {s.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <NewBookingForm slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      )}
    </div>
  );
}