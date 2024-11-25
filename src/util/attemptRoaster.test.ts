import { describe, it, expect } from 'vitest';
import attemptRoaster from './attemptRoaster';

describe('attemptRoaster', () => {
  it('returns correct message for mapped attempts', () => {
    expect(attemptRoaster(0)).toBe('Try adding Room ID first?');
    expect(attemptRoaster(5)).toBe('Still going strong, huh?');
    expect(attemptRoaster(25)).toBe(
      "🎉 Congratulations! You've unlocked the secret clicking championship!"
    );
  });

  it('returns default message for unmapped attempts', () => {
    expect(attemptRoaster(16)).toBe(
      "Attempt #16... I'm running out of things to say"
    );
  });

  it('returns impressed message for attempts over 35', () => {
    expect(attemptRoaster(36)).toBe(
      "Attempt #36... I'm not even mad, I'm impressed"
    );
    expect(attemptRoaster(100)).toBe(
      "Attempt #100... I'm not even mad, I'm impressed"
    );
  });
});
