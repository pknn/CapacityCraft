import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { roomSelector, toggleGlobalNonWorkingDay } from '../../store/roomSlice';
import { Day } from '../../types/Day';
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
    <thead>
      <tr>
        <th />
        {days.map((day, index) => (
          <CalendarHeadItem
            key={day.date}
            day={day}
            onClick={handleClick(index)}
          />
        ))}
      </tr>
    </thead>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  days: roomSelector.value(state).days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  toggleGlobalNonWorkingDay: (index) =>
    dispatch(toggleGlobalNonWorkingDay(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHead);
