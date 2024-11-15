import { useMemo } from 'react';
import { Day } from '../../store/sprintSlice';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';

type OwnProps = {
  day: Day;
  onClick: () => void;
};

type Props = OwnProps;

const CalendarHeadItem = ({ day, onClick }: Props) => {
  const { dayOfWeek, date, month, isWeekend } = useMemo(
    () => formatDateStringForDisplay(day.date),
    [day]
  );

  const isNonWorkingDay = useMemo(
    () => isWeekend || day.isNonWorkingDay,
    [isWeekend, day]
  );

  return (
    <div
      className={`w-full rounded text-center font-medium uppercase ${isWeekend ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
    >
      <div
        className={`rounded-t px-4 py-2 font-medium uppercase ${isNonWorkingDay ? 'bg-stone-600 text-stone-400' : 'bg-stone-300'}`}
      >
        {dayOfWeek}
      </div>
      <div
        className={`px-4 py-2 text-4xl font-bold ${isNonWorkingDay ? 'bg-stone-400 text-stone-300' : 'bg-stone-100'}`}
      >
        {date}
      </div>
      <div
        className={`px-4 py-2 ${isNonWorkingDay ? 'bg-stone-600 text-stone-400' : 'bg-stone-300'}`}
      >
        {month}
      </div>
    </div>
  );
};

export default CalendarHeadItem;
