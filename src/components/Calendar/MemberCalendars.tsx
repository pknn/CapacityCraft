import { connect } from 'react-redux';
import { AppState } from '../../store';
import MemberCalendar from './MemberCalendar';
import { Member } from '../../types/Member';

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
  members: state.members,
});

export default connect(mapStateToProps)(MemberCalendars);
