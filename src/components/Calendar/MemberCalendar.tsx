import { Member } from '../../store/sprintSlice';
import MemberCalendarItem from './MemberCalendarItem';

type OwnProps = {
  member: Member;
};

type Props = OwnProps;
const MemberCalendar = ({ member }: Props) => {
  const handleClick = () => {};
  return (
    <div className="flex">
      <div className="min-w-36">{member.displayName}</div>
      <div className="flex">
        {member.days.map((day) => (
          <MemberCalendarItem key={day.date} day={day} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

export default MemberCalendar;
