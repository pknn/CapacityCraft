import { Day } from '../../store/sprintSlice';

type OwnProps = {
  day: Day;
  onClick: () => void;
};

type Props = OwnProps;

const MemberCalendarItem = ({ day, onClick }: Props) => {
  return <div>{day.date}</div>;
};

export default MemberCalendarItem;
