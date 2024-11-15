import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { Day, toggleGlobalNonWorkingDay } from '../../store/sprintSlice';
import CalendarHead from './CalendarHead';
import Legend from './Legend';

type StateBindings = {
  days: Day[];
};

type ActionBindings = {
  toggleGlobalNonWorkingDay: (index: number) => void;
};

type Props = StateBindings & ActionBindings;

const Calendar = ({ days, toggleGlobalNonWorkingDay }: Props) => {
  const handleClick = (index: number) => () => {
    toggleGlobalNonWorkingDay(index);
  };

  return (
    <div className="flex">
      <div></div>
      <div className="flex-1">
        <Legend />
        <div className="flex gap-2">
          <div className="px-16" />
          {days.map((day, index) => (
            <CalendarHead
              key={day.date}
              day={day}
              onClick={handleClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  days: state.sprint.days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleGlobalNonWorkingDay: (index) =>
    dispatch(toggleGlobalNonWorkingDay(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
