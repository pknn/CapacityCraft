import { DayType, DayTypes } from '../types/Day';

const dayTypeToRatio = (dayType: DayType): number => {
  switch (dayType) {
    case DayTypes.FullDay:
      return 1;
    case DayTypes.HalfDay:
      return 0.5;
    case DayTypes.Holiday:
    case DayTypes.Weekend:
      return 0;
    default:
      return 0;
  }
};

export default dayTypeToRatio;
