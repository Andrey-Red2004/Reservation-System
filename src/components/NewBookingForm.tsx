import { useState } from 'react';
import { useBookings } from '../state/bookingsContext';

export default function NewBookingForm({ slot, onClose }: { slot: {start:string,end:string}; onClose: () => void }) {
  const { createBooking } = useBookings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Nuevo: para mostrar la segunda ventana
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    
    if (!email.trim()) {
      setError('El correo electrónico no puede estar vacío');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Si todo está bien → mostrar ventana de confirmación
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    const res = createBooking({ 
      userName: name, 
      userEmail: email, 
      start: slot.start, 
      end: slot.end, 
      notes: '' 
    });
    if (!res.ok) {
      setError(res.error ?? null);
      setShowConfirm(false);
      return;
    }
    onClose();
  };

  const startTime = new Date(slot.start).toLocaleTimeString('es-CR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      
      {/* Si NO se confirma aún, mostrar formulario */}
      {!showConfirm ? (
        <div className="bg-white p-4 rounded shadow-md w-96">
          <h3 className="text-lg font-bold mb-3">Reservar {startTime}</h3>
          
          <input 
            placeholder="Nombre" 
            value={name} 
            onChange={e => { setName(e.target.value); setError(null); }} 
            className="w-full mb-2 border p-2 rounded" 
          />
          
          <input 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => { setEmail(e.target.value); setError(null); }} 
            className="w-full mb-2 border p-2 rounded" 
          />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={validateForm} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Continuar
            </button>
            <button onClick={onClose} className="px-3 py-1 border rounded hover:bg-gray-100">
              Cancelar
            </button>
          </div>
        </div>
      ) : (

        // --------- VENTANA DE CONFIRMACIÓN ---------
        <div className="bg-white p-6 rounded shadow-lg w-80 border-t-8 border-blue-500">
          <h3 className="text-lg font-bold mb-4 text-center">Confirmación</h3>

          <p className="text-center text-gray-700 mb-4">
            Desea agendar su cita a las<br />
            <span className="text-xl font-bold">{startTime}</span>
          </p>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowConfirm(false)} 
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
            >
              Cancelar
            </button>

            <button 
              onClick={confirmBooking} 
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
