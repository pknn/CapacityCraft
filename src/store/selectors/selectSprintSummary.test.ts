import { describe, it, expect } from 'vitest';
import {
  selectTotalWorkingManDays,
  selectHolidays,
  selectCapacity,
} from './selectSprintSummary';
import { DayTypes } from '../../types/Day';
import type { AppState } from '..';
import type { Day } from '../../types/Day';

describe('Sprint Summary Selectors', () => {
  describe('selectTotalWorkingManDays', () => {
    it('should calculate total working days correctly with different day types', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.FullDay },
        { date: '2023-01-02', dayType: DayTypes.HalfDay },
        { date: '2023-01-03', dayType: DayTypes.Holiday },
      ];

      const mockDays2: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.FullDay },
        { date: '2023-01-02', dayType: DayTypes.FullDay },
        { date: '2023-01-03', dayType: DayTypes.Holiday },
      ];

      const mockState = {
        members: {
          current: {
            ids: ['1', '2'],
            entities: {
              '1': {
                id: '1',
                name: 'Member 1',
                days: mockDays,
              },
              '2': {
                id: '2',
                name: 'Member 2',
                days: mockDays2,
              },
            },
          },
        },
        room: {
          current: {
            baselineVelocity: 10,
            days: [],
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
      } as unknown as AppState;

      const result = selectTotalWorkingManDays(mockState);
      expect(result).toBe(3.5);
    });

    it('should return 0 when no members exist', () => {
      const mockState = {
        members: {
          current: {
            ids: [],
            entities: {},
          },
        },
        room: {
          current: {
            baselineVelocity: 0,
            days: [],
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
      } as unknown as AppState;

      const result = selectTotalWorkingManDays(mockState);
      expect(result).toBe(0);
    });
  });

  describe('selectHolidays', () => {
    it('should count holiday days correctly', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.Holiday },
        { date: '2023-01-02', dayType: DayTypes.FullDay },
        { date: '2023-01-03', dayType: DayTypes.Holiday },
        { date: '2023-01-04', dayType: DayTypes.HalfDay },
      ];

      const mockState = {
        room: {
          current: {
            baselineVelocity: 10,
            days: mockDays,
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
      } as unknown as AppState;

      const result = selectHolidays(mockState);
      expect(result).toBe(2);
    });

    it('should return 0 when no holidays exist', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.FullDay },
        { date: '2023-01-02', dayType: DayTypes.HalfDay },
      ];

      const mockState = {
        room: {
          current: {
            baselineVelocity: 10,
            days: mockDays,
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
      } as unknown as AppState;

      const result = selectHolidays(mockState);
      expect(result).toBe(0);
    });
  });

  describe('selectCapacity', () => {
    it('should calculate capacity correctly', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.FullDay },
        { date: '2023-01-02', dayType: DayTypes.FullDay },
      ];

      const mockState = {
        room: {
          current: {
            baselineVelocity: 10,
            days: [],
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
        members: {
          current: {
            ids: ['1'],
            entities: {
              '1': {
                id: '1',
                name: 'Member 1',
                days: mockDays,
              },
            },
          },
        },
      } as unknown as AppState;

      const result = selectCapacity(mockState);
      expect(result).toBe(20);
    });

    it('should round down capacity to nearest integer', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.HalfDay },
        { date: '2023-01-02', dayType: DayTypes.HalfDay },
      ];

      const mockState = {
        room: {
          current: {
            baselineVelocity: 10,
            days: [],
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
        members: {
          current: {
            ids: ['1'],
            entities: {
              '1': {
                id: '1',
                name: 'Member 1',
                days: mockDays,
              },
            },
          },
        },
      } as unknown as AppState;

      const result = selectCapacity(mockState);
      expect(result).toBe(10);
    });

    it('should return 0 when baseline velocity is 0', () => {
      const mockDays: Day[] = [
        { date: '2023-01-01', dayType: DayTypes.FullDay },
      ];

      const mockState = {
        room: {
          current: {
            baselineVelocity: 0,
            days: [],
            id: 'test-id',
            startDate: '2023-01-01',
          },
        },
        members: {
          current: {
            ids: ['1'],
            entities: {
              '1': {
                id: '1',
                name: 'Member 1',
                days: mockDays,
              },
            },
          },
        },
      } as unknown as AppState;

      const result = selectCapacity(mockState);
      expect(result).toBe(0);
    });
  });
});
