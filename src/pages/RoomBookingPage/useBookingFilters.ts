import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/utils';

export type BookingFilters = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  floor: number | null;
};

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: BookingFilters = {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')?.split(',').filter(Boolean) ?? [],
    floor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };

  const setFilter = (key: string, value: string | null) => {
    setSearchParams(
      prev => {
        if (value === null || value === '') {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
        return prev;
      },
      { replace: true }
    );
  };

  return { filters, setFilter };
}
