import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Member } from '../../store/sprintSlice';
import MemberCalendar from './MemberCalendar';

type StateBindings = {
  members: Record<string, Member>;
};

type Props = StateBindings;

const MemberCalendars = ({ members }: Props) => (
  <tbody>
    {Object.entries(members).map(([k, member]) => (
      <MemberCalendar key={k} id={k} member={member} />
    ))}
  </tbody>
);

const mapStateToProps = (state: AppState): StateBindings => ({
  members: state.sprint.members,
});

export default connect(mapStateToProps)(MemberCalendars);
