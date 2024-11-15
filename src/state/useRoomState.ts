import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type RoomState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
};

const useRoomState = create(
  devtools<RoomState>((set) => ({
    roomId: '',
    setRoomId: (roomId) => {
      set({
        roomId,
      });
    },
  }))
);

export default useRoomState;
