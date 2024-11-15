import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import CalendarHead from './CalendarHead';
import Legend from './Legend';
import UserCalendar from './UserCalendar';

type StateBindings = {};

type ActionBindings = {};

type Props = StateBindings & ActionBindings;

const Calendar = ({}: Props) => {
  return (
    <div className="flex">
      <div></div>
      <div className="flex-1">
        <Legend />
        <CalendarHead />
        <UserCalendar />
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
