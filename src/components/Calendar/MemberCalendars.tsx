import { connect } from 'react-redux';
import { AppState } from '../../store';
import MemberCalendar from './MemberCalendar';
import { Member } from '../../types/Member';
import { membersSelector } from '../../store/membersSlice';

type StateBindings = {
  members: Member[];
};

type Props = StateBindings;

const MemberCalendars = ({ members }: Props) => (
  <tbody>
    {members.map((member) => (
      <MemberCalendar key={member.id} id={member.id} member={member} />
    ))}
  </tbody>
);

const mapStateToProps = (state: AppState): StateBindings => ({
  members: membersSelector.selectAll(state),
});

export default connect(mapStateToProps)(MemberCalendars);
