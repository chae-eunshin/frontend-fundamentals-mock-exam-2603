import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Button, Text } from '_tosslib/components';
import { SectionHeader } from 'components/SectionHeader';
import { SectionDivider } from 'components/SectionDivider';
import { colors } from '_tosslib/constants/colors';
import { Room } from 'pages/types';
import { useRoomBooking } from './useRoomBooking';
import { useBookingFilters } from './useBookingFilters';
import { validateBookingFilter, getAvailableRooms } from './utils';
import { BookingFilterForm } from './BookingFilterForm';
import { RoomCard } from './RoomCard';
import { MessageBanner } from 'components/MessageBanner';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { filters, setFilter } = useBookingFilters();
  const { rooms, reservations, book, isPending } = useRoomBooking(filters.date);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const { isComplete: isFilterComplete, error: validationError } = validateBookingFilter(
    filters.startTime,
    filters.endTime,
    filters.attendees
  );

  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort(
    (a: number, b: number) => a - b
  );

  const availableRooms = isFilterComplete ? getAvailableRooms(rooms, reservations, filters) : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    const result = await book({
      roomId: selectedRoomId,
      date: filters.date,
      start: filters.startTime,
      end: filters.endTime,
      attendees: filters.attendees,
      equipment: filters.equipment,
    });

    if (result.ok) {
      navigate('/', { state: { message: '예약이 완료되었습니다!' } });
      return;
    }
    setErrorMessage(result.message);
    setSelectedRoomId(null);
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={12} />
          <MessageBanner message={{ type: 'error', text: errorMessage }} />
        </div>
      )}

      <Spacing size={24} />

      <BookingFilterForm
        filters={filters}
        setFilter={setFilter}
        onFilterChange={handleFilterChange}
        floors={floors}
        validationError={validationError}
      />

      <SectionDivider />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <div css={css`padding: 0 24px;`}>
          <SectionHeader title="예약 가능 회의실">
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {availableRooms.length}개
            </Text>
          </SectionHeader>

          {availableRooms.length === 0 ? (
            <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
              <Text typography="t6" color={colors.grey500}>
                조건에 맞는 회의실이 없습니다.
              </Text>
            </div>
          ) : (
            <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
              {availableRooms.map((room: Room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isSelected={selectedRoomId === room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                />
              ))}
            </div>
          )}

          <Spacing size={16} />
          <Button display="full" onClick={handleBook} disabled={isPending}>
            {isPending ? '예약 중...' : '확정'}
          </Button>
        </div>
      )}

      <Spacing size={24} />
    </div>
  );
}
