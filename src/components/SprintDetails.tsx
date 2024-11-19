import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../store';
import { setLength, setStartDate } from '../store/roomSlice';
import Input from './core/Input';
import SprintSummary from './SprintSummary';

type StateBindings = {
  length: number;
  startDate: string;
};

type ActionBindings = {
  setLength: (length: number) => void;
  setStartDate: (startDate: string) => void;
};

type Props = StateBindings & ActionBindings;

const SprintDetails = ({
  length,
  startDate,
  setLength,
  setStartDate,
}: Props) => {
  const handleSprintStartDateChange = (value: string) => {
    setStartDate(value);
  };

  const handleSprintLengthChange = (value: number) => {
    setLength(value <= 0 ? 0 : value);
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
  length: state.rooms.days.length,
  startDate: state.rooms.startDate,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  setLength: (length: number) => dispatch(setLength(length)),
  setStartDate: (startDate: string) => dispatch(setStartDate(startDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprintDetails);
