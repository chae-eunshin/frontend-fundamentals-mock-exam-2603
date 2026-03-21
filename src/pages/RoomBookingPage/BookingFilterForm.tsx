import { css } from '@emotion/react';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { TIME_SLOTS, EQUIPMENT_LABELS } from 'pages/constants';
import { DateInput } from 'components/DateInput';

import type { BookingFilters } from './useBookingFilters';

const ALL_EQUIPMENT = ['tv', 'whiteboard', 'video', 'speaker'];

interface BookingFilterFormProps {
  filters: BookingFilters;
  setFilter: (key: string, value: string | null) => void;
  onFilterChange: () => void;
  floors: number[];
  validationError: string | null;
}

export function BookingFilterForm({
  filters,
  setFilter,
  onFilterChange,
  floors,
  validationError,
}: BookingFilterFormProps) {
  return (
    <div css={css`padding: 0 24px;`}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      {/* 날짜 */}
      <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
        <DateInput
          value={filters.date}
          onChange={value => { setFilter('date', value); onFilterChange(); }}
        />
      </div>
      <Spacing size={14} />

      {/* 시간 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
          <Select
            value={filters.startTime}
            onChange={e => { setFilter('startTime', e.target.value); onFilterChange(); }}
            aria-label="시작 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
          <Select
            value={filters.endTime}
            onChange={e => { setFilter('endTime', e.target.value); onFilterChange(); }}
            aria-label="종료 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
          <input
            type="number"
            min={1}
            value={filters.attendees}
            onChange={e => { setFilter('attendees', String(Math.max(1, Number(e.target.value)))); onFilterChange(); }}
            aria-label="참석 인원"
            css={css`
              box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
              background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
              width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
              transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
            `}
          />
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
          <Select
            value={filters.floor ?? ''}
            onChange={e => {
              setFilter('floor', e.target.value || null);
              onFilterChange();
            }}
            aria-label="선호 층"
          >
            <option value="">전체</option>
            {floors.map((f: number) => (
              <option key={f} value={f}>{f}층</option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
        <Spacing size={8} />
        <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
          {ALL_EQUIPMENT.map(eq => {
            const selected = filters.equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => {
                  const next = selected ? filters.equipment.filter(e => e !== eq) : [...filters.equipment, eq];
                  setFilter('equipment', next.join(',') || null);
                  onFilterChange();
                }}
                aria-label={EQUIPMENT_LABELS[eq]}
                aria-pressed={selected}
                css={css`
                  padding: 8px 16px; border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
                  &:hover { border-color: ${selected ? colors.blue500 : colors.grey400}; }
                `}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>

      {validationError && (
        <>
          <Spacing size={8} />
          <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">{validationError}</span>
        </>
      )}
    </div>
  );
}
