import Input from './core/Input';
import { AppDispatch, RootState } from '../store';
import { setLength, setStartDate } from '../store/sprintSlice';
import { connect } from 'react-redux';

type StateProps = {
  length: number;
  startDate: string;
};

type DispatchProps = {
  setLength: (length: number) => void;
  setStartDate: (startDate: string) => void;
};

type Props = StateProps & DispatchProps;

const SprintDetailsInput = ({
  length,
  startDate,
  setLength,
  setStartDate,
}: Props) => {
  const handleSprintStartDateChange = (value: string) => {
    console.log(value);
    setStartDate(value);
  };

  const handleSprintLengthChange = (value: number) => {
    setLength(value <= 0 ? 0 : value);
  };

  return (
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
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  length: state.sprint.length,
  startDate: state.sprint.startDate,
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  setLength: (length: number) => dispatch(setLength(length)),
  setStartDate: (startDate: string) => dispatch(setStartDate(startDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprintDetailsInput);
