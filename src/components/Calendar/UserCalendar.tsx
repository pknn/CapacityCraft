import { connect } from 'react-redux';
import { AppState } from '../../store';

type StateBindings = {
  displayName: string;
};

type Props = StateBindings;

const UserCalendar = ({}: Props) => {
  return <div></div>;
};

const mapStateToProps = (state: AppState): StateBindings => ({
  displayName: state.user.displayName ?? '',
});

export default connect(mapStateToProps)(UserCalendar);
