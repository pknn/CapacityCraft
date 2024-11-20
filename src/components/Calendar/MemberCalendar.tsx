import { connect } from 'react-redux';
import { useMemo } from 'react';
import zip from '../../util/zip';
import { AppDispatch, AppState } from '../../store';
import { Member } from '../../types/Member';
import { Day } from '../../types/Day';
import {
  removeMember,
  toggleMemberNonWorkingDay,
} from '../../store/membersSlice';
import MemberCalendarItem from './MemberCalendarItem';
import { roomSelector } from '../../store/roomSlice';
import { syncUp } from '../../store/dataThunkActions';
import MemberCalendarHeadItem from './MemberCalendarHeadItem';

type OwnProps = {
  member: Member;
};

type StateBindings = {
  globalDays: Day[];
};

type ActionBindings = {
  toggleMemberNonWorkingDay: (id: string, day: number) => void;
  removeMember: (id: string) => void;
  syncUp: () => void;
};

type Props = OwnProps & StateBindings & ActionBindings;

const MemberCalendar = ({
  member,
  globalDays,
  toggleMemberNonWorkingDay,
  removeMember,
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

  const handleRemove = () => {
    removeMember(member.id);
    syncUp();
  };

  return (
    <tr>
      <MemberCalendarHeadItem member={member} onRemove={handleRemove} />
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
  removeMember: (id) => dispatch(removeMember(id)),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberCalendar);
