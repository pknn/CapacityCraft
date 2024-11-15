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
    <div className="flex flex-col">
      {Object.values(members).map((member) => (
        <MemberCalendar key={member.displayName} member={member} />
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  members: state.sprint.members,
});

export default connect(mapStateToProps)(MemberCalendars);
