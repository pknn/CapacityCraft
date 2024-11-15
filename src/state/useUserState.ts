import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type UserState = {
  displayName: string | undefined;
  id: number | undefined;
  setDisplayName: (displayName: string | undefined) => void;
  clearDisplayName: () => void;
};

const useUserState = create(
  devtools<UserState>((set) => ({
    displayName: undefined,
    id: 0,
    setDisplayName: (displayName: string | undefined) =>
      set({
        displayName,
      }),
    clearDisplayName: () => set({ displayName: undefined }),
  }))
);

export default useUserState;
