import { Member } from '../../store/sprintSlice';
import MemberCalendarItem from './MemberCalendarItem';

type OwnProps = {
  member: Member;
};

type Props = OwnProps;
const MemberCalendar = ({ member }: Props) => {
  const handleClick = () => {};
  return (
    <tr>
      <td>{member.displayName}</td>
      {member.days.map((day) => (
        <MemberCalendarItem key={day.date} day={day} onClick={handleClick} />
      ))}
    </tr>
  );
};

export default MemberCalendar;
