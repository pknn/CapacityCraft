import { useState } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../store';
import { setUser } from '../store/userSlice';
import genId from '../util/genId';
import { addMember } from '../store/membersSlice';
import Button from './core/Button';
import Input from './core/Input';
import { Day } from '../types/Day';

type StateBindings = {
  displayName: string | undefined;
  days: Day[];
};

type ActionBindings = {
  setUser: (id: string, displayName: string) => void;
  addMember: (id: string, displayName: string, days: Day[]) => void;
};

type Props = StateBindings & ActionBindings;

const UserOverlay = ({ displayName, days, setUser, addMember }: Props) => {
  const [value, setValue] = useState(displayName);
  const [shouldDisplay, setShouldDisplay] = useState(
    !displayName || displayName.length <= 0
  );

  const handleDisplayNameChange = (value: string) => {
    setValue(value);
  };

  const handleSubmit = () => {
    if (!value || value.length <= 0) {
      return;
    }

    setShouldDisplay(false);
    const id = genId();
    setUser(id, value);
    addMember(id, value, days);
  };

  return (
    shouldDisplay && (
      <div className="absolute inset-0 h-screen w-screen bg-stone-700/10 backdrop-blur-md">
        <div className="flex h-full items-center justify-center">
          <div>
            <div>Let your friends know who you are</div>

            <Input<string>
              value={value ?? ''}
              onValueChange={handleDisplayNameChange}
              name="user-name"
              placeholder="Mink"
              type={undefined}
              label="Name"
            />
            <Button onClick={handleSubmit}>Identify me!</Button>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  displayName: state.user.displayName,
  days: state.rooms.days,
});

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  setUser: (id: string, displayName: string) =>
    dispatch(setUser({ id, displayName })),
  addMember: (id: string, displayName: string, days: Day[]) =>
    dispatch(addMember({ id, displayName, days })),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserOverlay);
