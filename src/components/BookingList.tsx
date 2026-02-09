import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBookings } from '../state/bookingsContext';
import type { Reservation } from '../types';

export default function BookingList({ onEdit }: { onEdit?: (booking: Reservation) => void }) {
  const { bookings, cancelBooking } = useBookings();
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const handleCancelClick = (id: string) => {
    setShowCancelConfirm(id);
  };

  const confirmCancel = async (id: string) => {
    await cancelBooking(id);
    setShowCancelConfirm(null);
  };

  const handleEditClick = (booking: Reservation) => {
    if (onEdit) {
      onEdit(booking);
    }
  };

  // Filtrar solo reservas confirmadas (no canceladas)
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');

  if (!activeBookings.length) return <p className="text-gray-500 text-center py-4">No hay reservas.</p>;

  return (
    <>
      <ul className="space-y-2">
        {activeBookings.map(b => (
          <li 
            key={b.id} 
            className={`flex justify-between items-center border p-3 rounded ${
              b.status === 'cancelled' ? 'bg-gray-100 opacity-60' : 'bg-white'
            }`}
          >
            <div>
              <div className="font-semibold">
                {b.userName} 
                {b.status === 'cancelled' && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                    CANCELADA
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(b.start).toLocaleString('es-CR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </div>
              <div className="text-xs text-gray-500">{b.userEmail}</div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(b)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Modificar
              </button>
              <button 
                onClick={() => handleCancelClick(b.id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Cancelar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de confirmación de cancelación */}
      {showCancelConfirm && createPortal(
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl"
            style={{
              width: '300px',
              padding: '32px',
              border: '3px solid #e5e7eb'
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Cancelar Reserva
            </h3>

            <p className="text-center text-gray-700 mb-8">
              ¿Está seguro que desea cancelar esta reserva?
            </p>

            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowCancelConfirm(null)} 
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  minWidth: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
              >
                No
              </button>

              <button 
                onClick={() => confirmCancel(showCancelConfirm)} 
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  minWidth: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}