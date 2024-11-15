import { connect } from 'react-redux';
import { Day, toggleGlobalNonWorkingDay } from '../../store/sprintSlice';
import CalendarHeadItem from './CalendarHeadItem';

type StateBindings = {
  days: Day[];
};

type ActionBindings = {
  toggleGlobalNonWorkingDay: (index: number) => void;
};

type Props = StateBindings & ActionBindings;

const CalendarHead = ({ days, toggleGlobalNonWorkingDay }: Props) => {
  const handleClick = (index: number) => () => {
    toggleGlobalNonWorkingDay(index);
  };

  return (
    <div className="flex gap-2">
      <div className="px-16" />
      {days.map((day, index) => (
        <CalendarHeadItem
          key={day.date}
          day={day}
          onClick={handleClick(index)}
        />
      ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHead);
