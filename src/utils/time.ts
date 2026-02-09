import { addMinutes, isBefore, isEqual, parseISO } from 'date-fns';
import type { Reservation } from '../types';

export function makeSlotsForDay(date: Date, startHour = 9, endHour = 17, slotMinutes = 30) {
  const slots: { start: Date; end: Date }[] = [];
  let cursor = new Date(date);
  cursor.setHours(startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);
  while (isBefore(cursor, end) || isEqual(cursor, end)) {
    const slotEnd = addMinutes(cursor, slotMinutes);
    if (isBefore(slotEnd, addMinutes(end, 1))) {
      slots.push({ start: new Date(cursor), end: slotEnd });
    }
    cursor = slotEnd;
  }
  return slots;
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const A1 = parseISO(aStart);
  const A2 = parseISO(aEnd);
  const B1 = parseISO(bStart);
  const B2 = parseISO(bEnd);
  // overlap if startA < endB && startB < endA
  return A1 < B2 && B1 < A2;
}

export function hasOverlapWithExisting(res: Reservation, existing: Reservation[], excludeId?: string) {
  return existing.some(e => {
    // No comparar con la misma reserva
    if (e.id === excludeId) return false;
    
    // Solo comparar reservas confirmadas
    if (e.status !== 'confirmed') return false;
    
    // Si ambos tienen resourceId, deben ser el mismo para que haya conflicto
    // Si no tienen resourceId, asumir que todos usan el mismo recurso
    const sameResource = !res.resourceId && !e.resourceId ? true : res.resourceId === e.resourceId;
    
    if (!sameResource) return false;
    
    return overlaps(res.start, res.end, e.start, e.end);
  });
}