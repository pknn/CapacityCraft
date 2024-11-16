import { useMemo } from 'react';
import { Day } from '../../store/sprintSlice';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';

type OwnProps = {
  globalDay: Day;
  memberDay: Day;
  onClick: () => void;
};

type Props = OwnProps;

const MemberCalendarItem = ({ globalDay, memberDay, onClick }: Props) => {
  const { isWeekend } = useMemo(
    () => formatDateStringForDisplay(globalDay.date),
    [globalDay]
  );
  const isGlobalNonWorkingDay = useMemo(
    () => isWeekend || globalDay.isNonWorkingDay,
    [isWeekend, globalDay]
  );
  const isNonWorkingDay = useMemo(
    () => isGlobalNonWorkingDay || memberDay.isNonWorkingDay,
    [isGlobalNonWorkingDay, memberDay]
  );

  const handleClick = () => {
    if (isGlobalNonWorkingDay) return;
    onClick();
  };

  return (
    <td
      className={`border border-stone-200 ${isNonWorkingDay ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-300 hover:bg-stone-200'} ${isGlobalNonWorkingDay ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
    ></td>
  );
};

export default MemberCalendarItem;
