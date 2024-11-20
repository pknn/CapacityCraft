type DayType = 'full-day' | 'half-day' | 'holiday' | 'weekend';

export type Day = {
  date: string;
  isNonWorkingDay: boolean;
  dayType: DayType;
};
