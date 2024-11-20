export const genId = () => {
  const chars = 'ABCDEF1234567890';

  const getRandomChar = () =>
    chars.charAt(Math.floor(Math.random() * chars.length));

  const newId = Array.from({ length: 7 }, (_, i) =>
    i === 3 ? '-' : getRandomChar()
  ).join('');

  return newId;
};

export const genRoomId = () => genId();

export const genUserId = (roomId: string) => {
  const thisRoomKey = `userId:${roomId}`;
  Object.keys(localStorage)
    .filter((k) => k.startsWith('userId'))
    .filter((k) => k !== thisRoomKey)
    .forEach((k) => localStorage.removeItem(k));

  const userIdFromStorage = localStorage.getItem(thisRoomKey);
  if (userIdFromStorage) {
    return userIdFromStorage;
  }

  const newId = genId();

  localStorage.setItem(thisRoomKey, newId);

  return newId;
};
