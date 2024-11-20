import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { roomSelector, toggleGlobalOffDay } from '../../store/roomSlice';
import { Day } from '../../types/Day';
import CalendarHeadItem from './CalendarHeadItem';
import { syncUp } from '../../store/dataThunkActions';

type StateBindings = {
  days: Day[];
};

type ActionBindings = {
  toggleGlobalOffDay: (index: number) => void;
  syncUp: () => void;
};

type Props = StateBindings & ActionBindings;

const CalendarHead = ({ days, toggleGlobalOffDay, syncUp }: Props) => {
  const handleClick = (index: number) => () => {
    toggleGlobalOffDay(index);
    syncUp();
  };

  return (
    <thead>
      <tr>
        <th className="w-auto snap-start" />
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
  toggleGlobalOffDay: (index) => dispatch(toggleGlobalOffDay(index)),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHead);
