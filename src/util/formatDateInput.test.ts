import { describe, it, expect } from 'vitest';
import formatDate from './formatDateInput';

describe('formatDate', () => {
  it('formats date correctly with padding', () => {
    const date = new Date('2024-01-05');
    expect(formatDate(date)).toBe('2024-01-05');
  });

  it('handles single digit months and days', () => {
    const date = new Date('2024-05-07');
    expect(formatDate(date)).toBe('2024-05-07');
  });
});
