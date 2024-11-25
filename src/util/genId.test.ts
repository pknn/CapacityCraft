import { describe, it, expect, beforeEach } from 'vitest';
import { genId, genUserIdWithCache } from './genId';

describe('genId', () => {
  it('generates ID with correct format', () => {
    const id = genId();
    expect(id).toMatch(/^[A-F0-9]{3}-[A-F0-9]{3}$/);
  });
});

describe('genUserIdWithCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates and caches new ID for new room', () => {
    const roomId = 'TEST123';
    const userId = genUserIdWithCache(roomId);
    expect(userId).toMatch(/^[A-F0-9]{3}-[A-F0-9]{3}$/);
    expect(localStorage.getItem(`userId:${roomId}`)).toBe(userId);
  });

  it('returns cached ID for existing room', () => {
    const roomId = 'TEST123';
    const firstId = genUserIdWithCache(roomId);
    const secondId = genUserIdWithCache(roomId);
    expect(firstId).toBe(secondId);
  });
});
