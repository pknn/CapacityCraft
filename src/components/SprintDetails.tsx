import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../store';
import { roomSelector, setDaysLength, setStartDate } from '../store/roomSlice';
import Input from './core/Input';
import SprintSummary from './SprintSummary';
import { syncRoomUp } from '../store/dataThunkActions';

type StateBindings = {
  length: number;
  startDate: string;
};

type ActionBindings = {
  syncRoomUp: () => void;
  setDaysLength: (newLength: number, startDate: string) => void;
  setStartDate: (startDate: string) => void;
};

type Props = StateBindings & ActionBindings;

const SprintDetails = ({
  length,
  startDate,
  syncRoomUp,
  setDaysLength,
  setStartDate,
}: Props) => {
  const handleSprintStartDateChange = (value: string) => {
    setStartDate(value);
    syncRoomUp();
  };

  const handleSprintLengthChange = (value: number) => {
    setDaysLength(value <= 0 ? 0 : value, startDate);
    syncRoomUp();
  };

  return (
    <div className="flex items-baseline justify-between gap-4">
      <SprintSummary />
      <div className="flex gap-4">
        <Input<string>
          value={startDate}
          onValueChange={handleSprintStartDateChange}
          name={''}
          placeholder={''}
          label="Sprint start date"
          type="date"
        />
        <Input<number>
          value={length}
          onValueChange={handleSprintLengthChange}
          name={''}
          placeholder={''}
          label="Sprint length (days)"
          type="number"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  length: roomSelector.value(state).days.length,
  startDate: roomSelector.value(state).startDate,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  syncRoomUp: () => dispatch(syncRoomUp()),
  setDaysLength: (newLength: number, startDate: string) =>
    dispatch(setDaysLength({ newLength, startDate })),
  setStartDate: (startDate: string) => dispatch(setStartDate(startDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprintDetails);
