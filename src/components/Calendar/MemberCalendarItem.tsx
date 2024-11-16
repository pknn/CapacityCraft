import { Day } from '../../store/sprintSlice';

type OwnProps = {
  day: Day;
  onClick: () => void;
};

type Props = OwnProps;

const MemberCalendarItem = ({ day, onClick }: Props) => {
  return <td>{day.date}</td>;
};

export default MemberCalendarItem;
