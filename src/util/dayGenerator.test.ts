import { describe, it, expect } from 'vitest';
import { generateDay, generateDays, getUpdatedDays } from './dayGenerator';
import { Day, DayTypes } from '../types/Day';

describe('dayGenerator', () => {
  describe('generateDay', () => {
    it('generates weekday correctly', () => {
      // 2024-01-02 is a Tuesday
      const result = generateDay('2024-01-02', 0);
      expect(result).toEqual({
        date: '2024-01-02',
        dayType: DayTypes.FullDay
      });
    });

    it('generates weekend correctly', () => {
      // 2024-01-06 is a Saturday
      const result = generateDay('2024-01-02', 4);
      expect(result).toEqual({
        date: '2024-01-06',
        dayType: DayTypes.Weekend
      });
    });

    it('handles month rollover', () => {
      const result = generateDay('2024-01-31', 1);
      expect(result).toEqual({
        date: '2024-02-01',
        dayType: DayTypes.FullDay
      });
    });

    it('handles year rollover', () => {
      const result = generateDay('2024-12-31', 1);
      expect(result).toEqual({
        date: '2025-01-01',
        dayType: DayTypes.FullDay
      });
    });
  });

  describe('generateDays', () => {
    const startDate = '2024-01-02';
    const initialDays: Day[] = [
      { date: '2024-01-02', dayType: DayTypes.FullDay },
      { date: '2024-01-03', dayType: DayTypes.FullDay },
      { date: '2024-01-04', dayType: DayTypes.FullDay }
    ];

    it('extends days when newLength is greater', () => {
      const result = generateDays(startDate, initialDays, 5);
      expect(result).toHaveLength(5);
      expect(result[3]).toEqual({
        date: '2024-01-05',
        dayType: DayTypes.FullDay
      });
      expect(result[4]).toEqual({
        date: '2024-01-06',
        dayType: DayTypes.Weekend
      });
    });

    it('trims days when newLength is smaller', () => {
      const result = generateDays(startDate, initialDays, 2);
      expect(result).toHaveLength(2);
      expect(result).toEqual(initialDays.slice(0, 2));
    });

    it('returns same array when newLength equals current length', () => {
      const result = generateDays(startDate, initialDays, 3);
      expect(result).toEqual(initialDays);
    });

    it('handles zero newLength', () => {
      const result = generateDays(startDate, initialDays, 0);
      expect(result).toHaveLength(0);
    });
  });

  describe('getUpdatedDays', () => {
    const initialDays: Day[] = [
      { date: '2024-01-02', dayType: DayTypes.HalfDay },
      { date: '2024-01-03', dayType: DayTypes.FullDay },
      { date: '2024-01-04', dayType: DayTypes.Holiday }
    ];

    it('preserves existing day types when dates match', () => {
      const result = getUpdatedDays(initialDays, '2024-01-02');
      expect(result).toEqual(initialDays);
    });

    it('creates new days with correct types when shifting dates forward', () => {
      const result = getUpdatedDays(initialDays, '2024-01-03');
      expect(result).toEqual([
        { date: '2024-01-03', dayType: DayTypes.FullDay },
        { date: '2024-01-04', dayType: DayTypes.Holiday },
        { date: '2024-01-05', dayType: DayTypes.FullDay }
      ]);
    });

    it('handles weekend days correctly when shifting dates', () => {
      const result = getUpdatedDays(initialDays, '2024-01-05');
      expect(result).toEqual([
        { date: '2024-01-05', dayType: DayTypes.FullDay },
        { date: '2024-01-06', dayType: DayTypes.Weekend },
        { date: '2024-01-07', dayType: DayTypes.Weekend }
      ]);
    });

    it('maintains array length', () => {
      const result = getUpdatedDays(initialDays, '2024-02-01');
      expect(result).toHaveLength(initialDays.length);
    });

    it('handles month transitions', () => {
      const result = getUpdatedDays(initialDays, '2024-01-31');
      expect(result).toEqual([
        { date: '2024-01-31', dayType: DayTypes.FullDay },
        { date: '2024-02-01', dayType: DayTypes.FullDay },
        { date: '2024-02-02', dayType: DayTypes.FullDay }
      ]);
    });
  });
});
