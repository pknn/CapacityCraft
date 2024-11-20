import { connect } from 'react-redux';
import { AppState } from '../store';
import {
  selectHolidays,
  selectTotalWorkingDays,
} from '../store/selectors/selectSprintSummary';
import { roomSelector } from '../store/roomSlice';

type StateProps = {
  totalDays: number;
  totalWorkingDays: number;
  holidays: number;
};

type Props = StateProps;

const SprintSummary = ({ totalDays, totalWorkingDays, holidays }: Props) => (
  <div className="my-8">
    <h3 className="text-lg font-bold">Sprint Summary</h3>
    <table>
      <tbody>
        <tr>
          <th className="pr-4 text-left font-medium">Total Days</th>
          <td className="pr-4 text-right">{totalDays}</td>
          <td>Days</td>
        </tr>
        <tr>
          <th className="pr-4 text-left font-medium">Public Holidays</th>
          <td className="pr-4 text-right">{holidays}</td>
          <td>Days</td>
        </tr>
        <tr>
          <th className="pr-4 text-left font-medium">Total Working Days</th>
          <td className="pr-4 text-right">{totalWorkingDays}</td>
          <td>Days</td>
        </tr>
        <tr>
          <th className="text-left font-medium">Capacity</th>
          <td className="pr-4 text-right">22</td>
          <td>SPs</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  totalDays: roomSelector.value(state).days.length,
  totalWorkingDays: selectTotalWorkingDays(state),
  holidays: selectHolidays(state),
});

export default connect(mapStateToProps)(SprintSummary);
