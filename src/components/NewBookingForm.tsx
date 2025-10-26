// src/components/NewBookingForm.tsx
import { useState } from 'react';
import { useBookings } from '../state/bookingsContext';

export default function NewBookingForm({ slot, onClose }: { slot: {start:string,end:string}; onClose: () => void }) {
  const { createBooking } = useBookings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const res = createBooking({ userName: name, userEmail: email, start: slot.start, end: slot.end, notes: '' });
    if (!res.ok) {
      setError(res.error ?? null);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h3>Reservar {new Date(slot.start).toLocaleString()}</h3>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="w-full mb-2" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-2" />
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button onClick={submit} className="bg-blue-500 text-white px-3 py-1">Confirmar</button>
          <button onClick={onClose} className="px-3 py-1 border">Cancelar</button>
        </div>
      </div>
    </div>
  );
}