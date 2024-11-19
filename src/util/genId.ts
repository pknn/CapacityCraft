const genId = () => {
  const userIdFromStorage = localStorage.getItem('userId');
  if (userIdFromStorage) {
    return userIdFromStorage;
  }

  const chars = 'ABCDEF1234567890';

  const getRandomChar = () =>
    chars.charAt(Math.floor(Math.random() * chars.length));

  const newId = Array.from({ length: 7 }, (_, i) =>
    i === 3 ? '-' : getRandomChar()
  ).join('');

  localStorage.setItem('userId', newId);

  return newId;
};

export default genId;
