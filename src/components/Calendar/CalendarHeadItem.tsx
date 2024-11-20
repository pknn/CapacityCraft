import { useMemo } from 'react';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';
import { Day } from '../../types/Day';

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
    <th
      className={`snap-center rounded text-center font-medium uppercase ${isWeekend ? 'cursor-not-allowed' : 'group cursor-pointer'} select-none`}
      onClick={onClick}
    >
      <div
        className={`rounded-t px-4 py-2 font-medium uppercase ${isNonWorkingDay ? 'bg-stone-600 text-stone-400 group-hover:bg-stone-700' : 'bg-stone-300 group-hover:bg-stone-400'}`}
      >
        {dayOfWeek}
      </div>
      <div
        className={`px-4 py-2 text-4xl font-bold ${isNonWorkingDay ? 'bg-stone-400 text-stone-300 group-hover:bg-stone-500' : 'bg-stone-100 group-hover:bg-stone-200'}`}
      >
        {date}
      </div>
      <div
        className={`px-4 py-2 ${isNonWorkingDay ? 'bg-stone-600 text-stone-400 group-hover:bg-stone-700' : 'bg-stone-300 group-hover:bg-stone-400'}`}
      >
        {month}
      </div>
    </th>
  );
};

export default CalendarHeadItem;
