import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { roomSelector, toggleGlobalOffDay } from '../../store/roomSlice';
import { Day } from '../../types/Day';
import CalendarHeadItem from './CalendarHeadItem';
import { syncUp } from '../../store/dataThunkActions';

type StateProps = {
  days: Day[];
};

type DispatchProps = {
  toggleGlobalOffDay: (index: number) => void;
  syncUp: () => void;
};

type Props = StateProps & DispatchProps;

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

const mapStateToProps = (state: AppState): StateProps => ({
  days: roomSelector.value(state).days,
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  toggleGlobalOffDay: (index) => dispatch(toggleGlobalOffDay(index)),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHead);
