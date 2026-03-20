import type { BookingFilters } from './useBookingFilters';

type Room = { id: string; name: string; floor: number; capacity: number; equipment: string[] };
type Reservation = { roomId: string; date: string; start: string; end: string };

export function validateBookingFilter(
  startTime: string,
  endTime: string,
  attendees: number
): { isComplete: boolean; error: string | null } {
  if (!startTime || !endTime) return { isComplete: false, error: null };
  if (endTime <= startTime) return { isComplete: false, error: '종료 시간은 시작 시간보다 늦어야 합니다.' };
  if (attendees < 1) return { isComplete: false, error: '참석 인원은 1명 이상이어야 합니다.' };
  return { isComplete: true, error: null };
}

export function getAvailableRooms(rooms: Room[], reservations: Reservation[], filters: BookingFilters): Room[] {
  return rooms
    .filter(room => {
      if (room.capacity < filters.attendees) return false;
      if (!filters.equipment.every(eq => room.equipment.includes(eq))) return false;
      if (filters.floor !== null && room.floor !== filters.floor) return false;
      return !reservations.some(
        r =>
          r.roomId === room.id &&
          r.date === filters.date &&
          r.start < filters.endTime &&
          r.end > filters.startTime
      );
    })
    .sort((a, b) => (a.floor !== b.floor ? a.floor - b.floor : a.name.localeCompare(b.name)));
}
