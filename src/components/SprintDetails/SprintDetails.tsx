import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import {
  roomSelector,
  setBaselineVelocity,
  setDaysLength,
  setStartDate,
} from '../../store/roomSlice';
import Input from '../core/Input';
import SprintSummary from '../SprintSummary';
import { syncUp } from '../../store/dataThunkActions';

type StateProps = {
  length: number;
  startDate: string;
  baselineVelocity: number;
};

type DispatchProps = {
  syncUp: () => void;
  setDaysLength: (newLength: number, startDate: string) => void;
  setStartDate: (startDate: string) => void;
  setBaselineVelocity: (newVelocity: number) => void;
};

type Props = StateProps & DispatchProps;

const SprintDetails = ({
  length,
  startDate,
  baselineVelocity,
  syncUp,
  setDaysLength,
  setStartDate,
  setBaselineVelocity,
}: Props) => {
  const handleSprintStartDateChange = (value: string) => {
    setStartDate(value);
    syncUp();
  };

  const handleSprintLengthChange = (value: number) => {
    setDaysLength(value <= 0 ? 0 : value, startDate);
    syncUp();
  };
  const handleBaselineVelocityChange = (value: number) => {
    setBaselineVelocity(value);
    syncUp();
  };

  return (
    <div className="flex items-baseline justify-between gap-4">
      <SprintSummary />
      <div className="inline-flex gap-4">
        <Input<string>
          value={startDate}
          onValueChange={handleSprintStartDateChange}
          name="sprint-start-date"
          placeholder=""
          label="Start date"
          type="date"
        />
        <Input<number>
          className="max-w-16"
          value={length}
          onValueChange={handleSprintLengthChange}
          name="sprint-length"
          placeholder=""
          label="Length"
          type="number"
        />
        <Input<number>
          className="max-w-20"
          value={baselineVelocity}
          onValueChange={handleBaselineVelocityChange}
          name="baseline-velocity"
          placeholder=""
          label="Base Velocity"
          type="number"
          step={0.1}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  length: roomSelector.value(state).days.length,
  startDate: roomSelector.value(state).startDate ?? '',
  baselineVelocity: roomSelector.value(state).baselineVelocity,
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  syncUp: () => dispatch(syncUp()),
  setDaysLength: (newLength: number, startDate: string) =>
    dispatch(setDaysLength({ newLength, startDate })),
  setStartDate: (startDate: string) => dispatch(setStartDate(startDate)),
  setBaselineVelocity: (newVelocity) =>
    dispatch(setBaselineVelocity(newVelocity)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprintDetails);
