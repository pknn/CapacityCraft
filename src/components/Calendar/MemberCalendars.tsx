import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Member } from '../../store/sprintSlice';
import MemberCalendar from './MemberCalendar';

type StateBindings = {
  members: Record<string, Member>;
};

type Props = StateBindings;

const MemberCalendars = ({ members }: Props) => {
  return (
    <tbody>
      {Object.values(members).map((member) => (
        <MemberCalendar key={member.displayName} member={member} />
      ))}
    </tbody>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  members: state.sprint.members,
});

export default connect(mapStateToProps)(MemberCalendars);
