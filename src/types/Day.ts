export type DayType = 'full-day' | 'holiday' | 'weekend' | 'half-day';

export const DayTypes = {
  FullDay: 'full-day' as DayType,
  Holiday: 'holiday' as DayType,
  Weekend: 'weekend' as DayType,
  HalfDay: 'half-day' as DayType,
} as const;

export type Day = {
  date: string;
  isNonWorkingDay: boolean;
  dayType: DayType;
};
