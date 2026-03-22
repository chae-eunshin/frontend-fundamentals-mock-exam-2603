import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, getReservations, createReservation } from 'pages/api';
import { ReservationInput } from 'pages/types';
import axios from 'axios';

export function useRoomBooking(date: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

  const createMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  const book = async (params: ReservationInput): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      const result = await createMutation.mutateAsync(params);
      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return { ok: true };
      }
      return { ok: false, message: (result as { message?: string }).message ?? '예약에 실패했습니다.' };
    } catch (err) {
      let message = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        message = data?.message ?? message;
      }
      return { ok: false, message };
    }
  };

  return { rooms, reservations, book, isPending: createMutation.isPending };
}
