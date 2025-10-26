// src/utils/time.ts
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

export function hasOverlapWithExisting(res: Reservation, existing: Reservation[]) {
  return existing.some(e => e.resourceId === res.resourceId && e.status === 'confirmed' &&
    overlaps(res.start, res.end, e.start, e.end));
}