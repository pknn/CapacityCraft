import { useState } from 'react';
import Input from '../core/Input';
import Button from '../core/Button';
import { AppDispatch, AppState } from '../../store';
import { addMember } from '../../store/membersSlice';
import { Day } from '../../types/Day';
import { syncUp } from '../../store/dataThunkActions';
import { roomSelector } from '../../store/roomSlice';
import { connect } from 'react-redux';
import { genId } from '../../util/genId';

type StateProps = {
  days: Day[];
};

type DispatchProps = {
  addMember: (id: string, displayName: string, days: Day[]) => void;
  syncUp: () => Promise<unknown>;
};

type Props = StateProps & DispatchProps;

const ManuallyAddMember = ({ days, addMember, syncUp }: Props) => {
  const [displayName, setDisplayName] = useState('');

  const handleValueChange = (value: string) => {
    setDisplayName(value);
  };

  const handleMemberAdd = () => {
    if (displayName.length <= 0) return;

    const id = genId();
    addMember(id, displayName, days);
    syncUp();
  };

  return (
    <div>
      <span className="text-lg font-bold">Away But Counted ⭐</span>
      <div className="flex items-center gap-2">
        <Input<string>
          value={displayName}
          onValueChange={handleValueChange}
          name="manually-add-member"
          placeholder="Mimi"
          type="text"
        />
        <Button className="max-h-fit" onClick={handleMemberAdd}>
          Include!
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  days: roomSelector.value(state).days,
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  addMember: (id, displayName, days) =>
    dispatch(addMember({ id, displayName, days, isManual: true })),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManuallyAddMember);
