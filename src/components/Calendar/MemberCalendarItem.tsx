import { useMemo } from 'react';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';
import { Day } from '../../types/Day';

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

  const className = [
    'rounded',
    'border',
    'border-stone-200',
    isGlobalNonWorkingDay ? 'cursor-not-allowed' : 'cursor-pointer',
    isNonWorkingDay ? 'bg-stone-600' : 'bg-stone-300',
    isNonWorkingDay ? 'hover:bg-stone-600' : 'hover:bg-stone-400',
    isNonWorkingDay && !isGlobalNonWorkingDay ? 'hover:bg-stone-700' : '',
  ].join(' ');

  return <td className={className} onClick={handleClick}></td>;
};

export default MemberCalendarItem;
