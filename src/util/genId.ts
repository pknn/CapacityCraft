const genId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const getRandomChar = () =>
    chars.charAt(Math.floor(Math.random() * chars.length));

  const newId = Array.from({ length: 7 }, (_, i) =>
    i === 3 ? '-' : getRandomChar()
  ).join('');

  return newId;
};

export default genId;
