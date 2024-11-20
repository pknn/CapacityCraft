const attemptToastMap: Record<number, string> = {
  0: 'Try adding Room ID first?',
  1: 'Really?',
  2: 'What are you expecting?',
  3: 'Why are we still here?',
  4: 'Just... why?',
  5: 'Still going strong, huh?',
  6: 'Persistence or stubbornness?',
  7: 'Achievement unlocked: Maximum Attempts',
  8: 'This is getting awkward',
  9: 'You must really like this button',
  10: '🤦‍♂️',
  11: '*slow clap*',
  12: "Legend says they're still clicking",
  13: 'Have you tried turning it off and on again?',
  14: 'Maybe take a coffee break?',
  15: 'Are we having fun yet?',
  25: "🎉 Congratulations! You've unlocked the secret clicking championship!",
  26: '🏆 Your dedication is... concerning but impressive',
  27: '🎸 Never gonna give you up, never gonna let you down...',
  30: '🦄 A wild unicorn appears! It judges you silently.',
  33: '🎨 You could have painted a masterpiece in this time',
  35: '🌟 Achievement Unlocked: Supreme Master of Pointless Clicking',
};

const attemptRoaster = (count: number): string =>
  count > 35
    ? `Attempt #${count}... I'm not even mad, I'm impressed`
    : (attemptToastMap[count] ??
      `Attempt #${count}... I'm running out of things to say`);

export default attemptRoaster;
