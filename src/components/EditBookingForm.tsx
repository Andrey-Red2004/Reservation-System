import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBookings } from '../state/bookingsContext';
import type { Reservation } from '../types';

export default function EditBookingForm({ 
  booking, 
  slot, 
  onClose 
}: { 
  booking: Reservation;
  slot: {start:string, end:string}; 
  onClose: () => void 
}) {
  const { updateBooking } = useBookings();
  const [name, setName] = useState(booking.userName);
  const [email, setEmail] = useState(booking.userEmail || '');
  const [error, setError] = useState<string | null>(null);
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

    const selectDate = new Date(slot.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectDate.setHours(0, 0, 0, 0);
    if (selectDate < today) {
      setError('No se pueden elegir fechas ni horas pasadas');
      return;
    }

    const selectedDateTime = new Date(slot.start);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (selectedDateTime < oneHourFromNow) {
      setError('Las reservas deben hacerse con al menos 1 hora de anticipación');
      return;
    }

    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    const res = await updateBooking(booking.id, { 
      userName: name, 
      userEmail: email, 
      start: slot.start, 
      end: slot.end, 
      notes: booking.notes || '' 
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

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30" style={{ zIndex: 9998 }}>
        <div className="bg-white p-4 rounded shadow-md w-96">
          <h3 className="text-lg font-bold mb-3">Modificar Reserva - {startTime}</h3>
          
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
            <button onClick={validateForm} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Guardar Cambios
            </button>
            <button onClick={onClose} className="px-3 py-1 border rounded hover:bg-gray-100">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {showConfirm && createPortal(
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center" 
          style={{ 
            zIndex: 99999, 
            backgroundColor: 'rgba(0, 0, 0, 1)',
            position: 'fixed'
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl"
            style={{
              width: '250px',
              padding: '32px',
              border: '3px solid #e5e7eb',
              position: 'relative',
              zIndex: 100000
            }}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
              Confirmación
            </h3>

            <div className="text-center mb-8">
              <p className="text-gray-700 mb-3">
                ¿Desea modificar su cita a las
              </p>
              <p className="text-4xl font-bold text-green-600">
                {startTime}?
              </p>
            </div>

            <div className="flex gap-8">
              <button 
                onClick={() => setShowConfirm(false)} 
                style={{
                  flex: 1,
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Cancelar
              </button>

              <button 
                onClick={confirmUpdate} 
                style={{
                  flex: 1,
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                Ok
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}