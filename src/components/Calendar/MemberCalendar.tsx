import { connect } from 'react-redux';
import { useMemo } from 'react';
import zip from '../../util/zip';
import { AppDispatch, AppState } from '../../store';
import { Member } from '../../types/Member';
import { Day } from '../../types/Day';
import { toggleMemberNonWorkingDay } from '../../store/membersSlice';
import MemberCalendarItem from './MemberCalendarItem';

type OwnProps = {
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
    toggleMemberNonWorkingDay(member.id, day);
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
  globalDays: state.rooms.days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleMemberNonWorkingDay: (id, dayIndex) =>
    dispatch(toggleMemberNonWorkingDay({ id, dayIndex })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberCalendar);
