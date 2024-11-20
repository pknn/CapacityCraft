import { Day, DayTypes } from '../../types/Day';

type OwnProps = {
  globalDay: Day;
  memberDay: Day;
  onClick: () => void;
};

type Props = OwnProps;

const MemberCalendarItem = ({ globalDay, memberDay, onClick }: Props) => {
  const isGlobalOffDay = [DayTypes.Weekend, DayTypes.Holiday].includes(
    globalDay.dayType
  );
  const isPersonalOffDay = [DayTypes.Weekend, DayTypes.Holiday].includes(
    memberDay.dayType
  );
  const isOffDay = isGlobalOffDay || isPersonalOffDay;
  const isFullDay = memberDay.dayType === DayTypes.FullDay;
  const isHalfDay = memberDay.dayType === DayTypes.HalfDay;

  const handleClick = () => {
    if (isGlobalOffDay) return;
    onClick();
  };

  const className = [
    'rounded',
    'border',
    'border-stone-200',
    isGlobalOffDay ? 'cursor-not-allowed' : 'cursor-pointer',
    isOffDay && isGlobalOffDay && 'bg-stone-700 hover:bg-stone-700',
    isOffDay && !isGlobalOffDay && 'bg-stone-700 hover:bg-stone-800',
    isFullDay && 'bg-stone-300 hover:bg-stone-400',
    isHalfDay && 'bg-stone-500 hover:bg-stone-600',
  ].join(' ');

  return <td className={className} onClick={handleClick}></td>;
};

export default MemberCalendarItem;
