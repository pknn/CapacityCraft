import Input from './core/Input';
import { useState } from 'react';
import Button from './core/Button';
import { AppDispatch, RootState } from '../store';
import { setDisplayName } from '../store/userSlice';
import { connect } from 'react-redux';

type StateProps = {
  displayName: string | undefined;
};

type DispatchProps = {
  setDisplayName: (displayName: string) => void;
};

type Props = StateProps & DispatchProps;

const UserOverlay = ({ displayName, setDisplayName }: Props) => {
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
    setDisplayName(value);
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

const mapStateToProps = (state: RootState): StateProps => ({
  displayName: state.user.displayName,
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  setDisplayName: (displayName: string) =>
    dispatch(setDisplayName(displayName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserOverlay);
