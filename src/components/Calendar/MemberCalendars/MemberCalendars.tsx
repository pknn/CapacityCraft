import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { Member } from '../../../types/Member';
import { membersSelector } from '../../../store/membersSlice';
import MemberCalendar from './MemberCalendar';

type StateProps = {
  members: Member[];
};

type Props = StateProps;

const MemberCalendars = ({ members }: Props) => (
  <tbody>
    {members.map((member) => (
      <MemberCalendar key={member.id} member={member} />
    ))}
  </tbody>
);

const mapStateToProps = (state: AppState): StateProps => ({
  members: membersSelector.selectAll(state),
});

export default connect(mapStateToProps)(MemberCalendars);
