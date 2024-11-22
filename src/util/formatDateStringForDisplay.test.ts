import { describe, it, expect } from 'vitest';
import formatDateStringForDisplay from './formatDateStringForDisplay';

describe('formatDateStringForDisplay', () => {
  it('formats date string correctly', () => {
    const result = formatDateStringForDisplay('2024-01-05');
    expect(result).toEqual({
      dayOfWeek: 'Fri',
      date: '5',
      month: 'Jan',
    });
  });
});
