import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { Day, toggleNonWorkingDay } from '../../store/sprintSlice';
import CalendarItem from './CalendarItem';
import Legend from './Legend';

type StateBindings = {
  days: Day[];
};

type ActionBindings = {
  toggleNonWorkingDay: (index: number) => void;
};

type Props = StateBindings & ActionBindings;

const Calendar = ({ days, toggleNonWorkingDay }: Props) => {
  const handleClick = (index: number) => () => {
    toggleNonWorkingDay(index);
  };

  return (
    <div>
      <Legend />
      <div className="flex gap-2">
        {days.map((day, index) => (
          <CalendarItem key={day.date} day={day} onClick={handleClick(index)} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  days: state.sprint.days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleNonWorkingDay: (index) => dispatch(toggleNonWorkingDay(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
