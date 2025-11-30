// src/components/BookingList.tsx

import { useBookings } from '../state/bookingsContext';

export default function BookingList() {
  const { bookings, deleteBooking } = useBookings();
  if (!bookings.length) return <p>No hay reservas.</p>;
  return (
    <ul>
      {bookings.map(b => (
        <li key={b.id} className="flex justify-between items-center border p-2 mb-1">
          <div>
            <div><strong>{b.userName}</strong> — {new Date(b.start).toLocaleString()}</div>
            <div className="text-sm text-gray-600">{b.userEmail}</div>
          </div>
          <div>
            <button onClick={() => deleteBooking(b.id)} className="text-red-900 font-bold">Cancelar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}