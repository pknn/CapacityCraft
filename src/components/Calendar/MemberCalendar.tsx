import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import {
  Day,
  Member,
  toggleMemberNonWorkingDay,
} from '../../store/sprintSlice';
import MemberCalendarItem from './MemberCalendarItem';
import zip from '../../util/zip';
import { useMemo } from 'react';

type OwnProps = {
  id: string;
  member: Member;
};

type StateBindings = {
  globalDays: Day[];
};

type ActionBindings = {
  toggleMemberNonWorkingDay: (id: string, day: number) => void;
};

type Props = OwnProps & StateBindings & ActionBindings;

const MemberCalendar = ({
  id,
  member,
  globalDays,
  toggleMemberNonWorkingDay,
}: Props) => {
  const zippedDays = useMemo(
    () =>
      globalDays.length && member.days.length
        ? zip(globalDays, member.days)
        : [],
    [globalDays, member]
  );

  const handleClick = (day: number) => () => {
    toggleMemberNonWorkingDay(id, day);
  };

  return (
    <tr>
      <td className="p-2 text-lg font-medium">{member.displayName}</td>
      {zippedDays.map(([globalDay, memberDay], day) => (
        <MemberCalendarItem
          key={memberDay.date}
          globalDay={globalDay}
          memberDay={memberDay}
          onClick={handleClick(day)}
        />
      ))}
    </tr>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  globalDays: state.sprint.days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleMemberNonWorkingDay: (id, day) =>
    dispatch(toggleMemberNonWorkingDay({ id, day })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberCalendar);
