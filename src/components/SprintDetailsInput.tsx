import { useShallow } from 'zustand/shallow';
import useSprintDetails from '../state/useSprintDetails';
import Input from './core/Input';
import formatDate from '../util/formatDate';

const SprintDetailsInput = () => {
  const { startDate, setStartDate, length, setLength } = useSprintDetails(
    useShallow((state) => ({
      startDate: state.startDate,
      setStartDate: state.setStartDate,
      length: state.length,
      setLength: state.setLength,
    }))
  );

  const handleSprintStartDateChange = (value: string) => {
    console.log(value);
    setStartDate(new Date(value));
  };

  const handleSprintLengthChange = (value: number) => {
    setLength(value <= 0 ? 0 : value);
  };

  return (
    <div className="flex gap-4">
      <Input<string>
        value={formatDate(startDate)}
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

export default SprintDetailsInput;
