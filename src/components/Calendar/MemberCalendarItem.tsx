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

  const handleClick = () => {
    if (isGlobalOffDay) return;
    onClick();
  };

  const className = [
    'rounded',
    'border',
    'border-stone-200',
    isGlobalOffDay ? 'cursor-not-allowed' : 'cursor-pointer',
    isOffDay ? 'bg-stone-600' : 'bg-stone-300',
    isOffDay ? 'hover:bg-stone-600' : 'hover:bg-stone-400',
    isOffDay && !isGlobalOffDay ? 'hover:bg-stone-700' : '',
  ].join(' ');

  return <td className={className} onClick={handleClick}></td>;
};

export default MemberCalendarItem;
