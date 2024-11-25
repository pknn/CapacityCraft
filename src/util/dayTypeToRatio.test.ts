import { describe, it, expect } from 'vitest';
import dayTypeToRatio from './dayTypeToRatio';
import { DayTypes } from '../types/Day';

describe('dayTypeToRatio', () => {
  it('returns 1 for FullDay', () => {
    expect(dayTypeToRatio(DayTypes.FullDay)).toBe(1);
  });

  it('returns 0.5 for HalfDay', () => {
    expect(dayTypeToRatio(DayTypes.HalfDay)).toBe(0.5);
  });

  it('returns 0 for Holiday', () => {
    expect(dayTypeToRatio(DayTypes.Holiday)).toBe(0);
  });

  it('returns 0 for Weekend', () => {
    expect(dayTypeToRatio(DayTypes.Weekend)).toBe(0);
  });
});
