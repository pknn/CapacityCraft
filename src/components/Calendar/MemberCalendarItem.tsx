import { useMemo } from 'react';
import { Day } from '../../store/sprintSlice';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';

type OwnProps = {
  day: Day;
  onClick: () => void;
};

type Props = OwnProps;

const MemberCalendarItem = ({ day, onClick }: Props) => {
  const { isWeekend } = useMemo(
    () => formatDateStringForDisplay(day.date),
    [day]
  );
  const isNonWorkingDay = useMemo(
    () => isWeekend || day.isNonWorkingDay,
    [isWeekend, day]
  );
  return (
    <td
      className={`border border-stone-200 ${isNonWorkingDay ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-300 hover:bg-stone-200'} ${isWeekend ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    ></td>
  );
};

export default MemberCalendarItem;
