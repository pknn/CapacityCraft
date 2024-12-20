import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { setUser } from '../../store/userSlice';
import { genUserIdWithCache } from '../../util/genId';
import { addMember } from '../../store/membersSlice';
import Button from '../core/Button';
import Input from '../core/Input';
import { roomSelector } from '../../store/roomSlice';
import { Day } from '../../types/Day';
import { syncUp } from '../../store/dataThunkActions';

type StateProps = {
  displayName: string | undefined;
  roomId: string;
  days: Day[];
  isLoading: boolean;
};

type DispatchProps = {
  setUser: (id: string, displayName: string) => void;
  addMember: (id: string, displayName: string, days: Day[]) => void;
  syncUp: () => Promise<unknown>;
};

type Props = StateProps & DispatchProps;

const UserOverlay = ({
  displayName,
  roomId,
  days,
  isLoading,
  setUser,
  addMember,
  syncUp,
}: Props) => {
  const [value, setValue] = useState(displayName);
  const [shouldDisplay, setShouldDisplay] = useState(
    !displayName || displayName.length <= 0
  );

  useEffect(() => {
    if (!displayName) {
      setShouldDisplay(true);
    }
  }, [displayName]);

  const handleDisplayNameChange = (value: string) => {
    setValue(value);
  };

  const handleSubmit = async () => {
    if (!value || value.length <= 0) {
      return;
    }

    const id = genUserIdWithCache(roomId);
    setUser(id, value);
    addMember(id, value, days);
    await syncUp();
    setShouldDisplay(false);
  };

  return (
    shouldDisplay && (
      <div className="absolute inset-0 z-50 h-screen w-screen bg-stone-700/20 backdrop-blur-lg">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-start">
            <span>Let your friends know who you are</span>

            <Input<string>
              className="max-w-full"
              value={value ?? ''}
              onValueChange={handleDisplayNameChange}
              name="user-name"
              placeholder="Mink"
              type={undefined}
            />
            <Button
              variant={isLoading ? 'loading' : 'default'}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Identify me!
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  displayName: state.user.displayName,
  roomId: roomSelector.value(state).id ?? '',
  days: roomSelector.value(state).days,
  isLoading: state.status.status === 'loading',
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  setUser: (id: string, displayName: string) =>
    dispatch(setUser({ id, displayName })),
  addMember: (id: string, displayName: string, days: Day[]) =>
    dispatch(addMember({ id, displayName, days, isManual: false })),
  syncUp: () => dispatch(syncUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserOverlay);
