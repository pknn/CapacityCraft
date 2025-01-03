import { Day, DayTypes } from '../types/Day';
import formatDate from './formatDateInput';
import isWeekend from './isWeekend';

export const generateDay = (startDate: string, offset: number): Day => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + offset);
  return {
    date: formatDate(date),
    dayType: isWeekend(date) ? DayTypes.Weekend : DayTypes.FullDay,
  };
};

export const generateDays = (
  startDate: string,
  currentDays: Day[],
  newLength: number
): Day[] => {
  if (newLength > currentDays.length) {
    // Extend days
    const additionalDays = Array.from(
      { length: newLength - currentDays.length },
      (_, i) => generateDay(startDate, currentDays.length + i)
    );
    return [...currentDays, ...additionalDays];
  }

  // Trim excess days
  return currentDays.slice(0, newLength);
};

export const getUpdatedDays = (days: Day[], newStartDateStr: string): Day[] =>
  days.map((_, index) => {
    const calculatedDate = new Date(newStartDateStr);
    calculatedDate.setDate(calculatedDate.getDate() + index);
    const formattedDate = formatDate(calculatedDate);

    // Keep existing day if date matches, otherwise create a new one
    return (
      days.find((day) => day.date === formattedDate) || {
        date: formattedDate,
        dayType: isWeekend(calculatedDate)
          ? DayTypes.Weekend
          : DayTypes.FullDay,
      }
    );
  });
