export type DayType = 'full-day' | 'holiday' | 'weekend' | 'half-day';

export const DayTypes = {
  FullDay: 'full-day' as DayType,
  Holiday: 'holiday' as DayType,
  Weekend: 'weekend' as DayType,
  HalfDay: 'half-day' as DayType,
} as const;

export type Day = {
  date: string;
  dayType: DayType;
};

export const toggleGlobalDayType = (dayType: DayType): DayType => {
  switch (dayType) {
    case DayTypes.FullDay:
      return DayTypes.Holiday;
    case DayTypes.Holiday:
      return DayTypes.FullDay;
    default:
      return dayType;
  }
};

export const toggleMemberOffDayType = (dayType: DayType): DayType => {
  switch (dayType) {
    case DayTypes.FullDay:
      return DayTypes.HalfDay;
    case DayTypes.HalfDay:
      return DayTypes.Holiday;
    case DayTypes.Holiday:
      return DayTypes.FullDay;
    default:
      return dayType;
  }
};
