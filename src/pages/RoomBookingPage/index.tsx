import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Button, Text, ListRow } from '_tosslib/components';
import { SectionHeader } from 'components/SectionHeader';
import { SectionDivider } from 'components/SectionDivider';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from 'pages/constants';
import { useRoomBooking } from './useRoomBooking';
import { useBookingFilters } from './useBookingFilters';
import { validateBookingFilter, getAvailableRooms } from './utils';
import { BookingFilterForm } from './BookingFilterForm';

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
    if (!filters.startTime || !filters.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
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

    if (!result.ok) {
      setErrorMessage(result.message);
      setSelectedRoomId(null);
    }
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
          <div
            css={css`
              padding: 10px 14px; border-radius: 10px; background: ${colors.red50};
              display: flex; align-items: center; gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>{errorMessage}</Text>
          </div>
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
              {availableRooms.map((room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={room.name}
                    css={css`
                      cursor: pointer; padding: 14px 16px; border-radius: 14px;
                      border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
                      background: ${isSelected ? colors.blue50 : colors.white};
                      transition: all 0.15s;
                      &:hover { border-color: ${isSelected ? colors.blue500 : colors.grey300}; }
                    `}
                  >
                    <ListRow
                      contents={
                        <ListRow.Text2Rows
                          top={room.name}
                          topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                          bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}`}
                          bottomProps={{ typography: 't7', color: colors.grey600 }}
                        />
                      }
                      right={
                        isSelected ? (
                          <Text typography="t7" fontWeight="bold" color={colors.blue500}>선택됨</Text>
                        ) : undefined
                      }
                    />
                  </div>
                );
              })}
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
