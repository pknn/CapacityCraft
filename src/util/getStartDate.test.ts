import { describe, it, expect } from 'vitest';
import getStartDate from './getStartDate';
import { Day, DayTypes } from '../types/Day';

describe('getStartDate', () => {
  it('returns earliest date from array of days', () => {
    const days: Day[] = [
      { date: '2024-01-15', dayType: DayTypes.FullDay },
      { date: '2024-01-01', dayType: DayTypes.FullDay },
      { date: '2024-01-30', dayType: DayTypes.FullDay },
    ];

    expect(getStartDate(days)).toBe('2024-01-01');
  });

  it('works with single day array', () => {
    const days: Day[] = [{ date: '2024-01-15', dayType: DayTypes.FullDay }];

    expect(getStartDate(days)).toBe('2024-01-15');
  });

  it('handles dates in different months', () => {
    const days: Day[] = [
      { date: '2024-02-15', dayType: DayTypes.FullDay },
      { date: '2024-01-15', dayType: DayTypes.FullDay },
      { date: '2024-03-15', dayType: DayTypes.FullDay },
    ];

    expect(getStartDate(days)).toBe('2024-01-15');
  });

  it('handles dates in different years', () => {
    const days: Day[] = [
      { date: '2024-01-15', dayType: DayTypes.FullDay },
      { date: '2023-12-31', dayType: DayTypes.FullDay },
      { date: '2025-01-01', dayType: DayTypes.FullDay },
    ];

    expect(getStartDate(days)).toBe('2023-12-31');
  });

  it('works with unsorted input', () => {
    const days: Day[] = [
      { date: '2024-01-30', dayType: DayTypes.Weekend },
      { date: '2024-01-01', dayType: DayTypes.FullDay },
      { date: '2024-01-15', dayType: DayTypes.HalfDay },
    ];

    expect(getStartDate(days)).toBe('2024-01-01');
  });
});
