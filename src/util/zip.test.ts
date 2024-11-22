import { describe, it, expect } from 'vitest';
import zip from './zip';

describe('zip', () => {
  it('zips arrays of equal length', () => {
    const result = zip([1, 2, 3], ['a', 'b', 'c']);
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('zips arrays of unequal length', () => {
    const result = zip([1, 2, 3], ['a', 'b']);
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('returns empty array for empty inputs', () => {
    const result = zip([], []);
    expect(result).toEqual([]);
  });
});
