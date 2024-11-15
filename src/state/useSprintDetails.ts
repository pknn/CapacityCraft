import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type SprintDetails = {
  length: number;
  startDate: Date;
  setLength: (length: number) => void;
  setStartDate: (date: Date) => void;
};

const useSprintDetails = create(
  devtools<SprintDetails>((set) => ({
    length: 0,
    startDate: new Date(),
    setLength: (length) => set({ length }),
    setStartDate: (date) => set({ startDate: date }),
  }))
);

export default useSprintDetails;
