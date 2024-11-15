import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type RoomState = {
  roomId: string;
  generateRoomId: () => void;
  setRoomId: (roomId: string) => void;
};

const useRoomState = create(
  devtools<RoomState>((set) => ({
    roomId: '',
    generateRoomId: () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const getRandomChar = () =>
        chars.charAt(Math.floor(Math.random() * chars.length));

      const newId = Array.from({ length: 7 }, (_, i) =>
        i === 3 ? '-' : getRandomChar()
      ).join('');

      set({
        roomId: newId,
      });
    },
    setRoomId: (roomId) => {
      set({
        roomId,
      });
    },
  }))
);

export default useRoomState;
