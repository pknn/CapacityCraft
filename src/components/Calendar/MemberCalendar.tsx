import { connect } from 'react-redux';
import { useMemo } from 'react';
import zip from '../../util/zip';
import { AppDispatch, AppState } from '../../store';
import { Member } from '../../types/Member';
import { Day } from '../../types/Day';
import { toggleMemberNonWorkingDay } from '../../store/membersSlice';
import MemberCalendarItem from './MemberCalendarItem';
import { roomSelector } from '../../store/roomSlice';
import { syncUp } from '../../store/dataThunkActions';

type OwnProps = {
  member: Member;
};

type StateBindings = {
  globalDays: Day[];
};

type ActionBindings = {
  toggleMemberNonWorkingDay: (id: string, day: number) => void;
  syncUp: () => void;
};

type Props = OwnProps & StateBindings & ActionBindings;

const MemberCalendar = ({
  member,
  globalDays,
  toggleMemberNonWorkingDay,
  syncUp,
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
    syncUp();
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
  globalDays: roomSelector.value(state).days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleMemberNonWorkingDay: (id, dayIndex) =>
    dispatch(toggleMemberNonWorkingDay({ id, dayIndex })),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberCalendar);
