import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';

export function useReservationStatus(date: string) {
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });
  const { data: myReservationList = [] } = useQuery({
    queryKey: ['myReservations'],
    queryFn: getMyReservations,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  return { rooms, reservations, myReservationList, cancelMutation };
}
