import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Member } from '../../store/sprintSlice';

type StateBindings = {
  members: Record<string, Member>;
};

type Props = StateBindings;

const UserCalendar = ({ members }: Props) => {
  return (
    <div className="flex flex-col">
      {Object.values(members).map((member) => (
        <span>{member.displayName}</span>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  members: state.sprint.members,
});

export default connect(mapStateToProps)(UserCalendar);
