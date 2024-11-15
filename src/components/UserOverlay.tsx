import { useShallow } from 'zustand/shallow';
import useUserState from '../state/useUserState';
import Button from './core/Button';
import Input from './core/Input';
import { useState } from 'react';

const UserOverlay = () => {
  const { displayName, setDisplayName } = useUserState(
    useShallow((state) => ({
      displayName: state.displayName,
      setDisplayName: state.setDisplayName,
    }))
  );

  const [shouldDisplay, setShouldDisplay] = useState(
    !displayName || displayName.length <= 0
  );

  const handleDisplayNameChange = (value: string | undefined) => {
    setDisplayName(value);
  };

  const handleSubmit = () => {
    setShouldDisplay((displayName?.length ?? 0) <= 0);
  };

  return (
    shouldDisplay && (
      <div className="absolute inset-0 h-screen w-screen bg-stone-700/10 backdrop-blur-md">
        <div className="flex h-full items-center justify-center">
          <div>
            <div>Let your friends know who you are</div>

            <Input<string | undefined>
              value={displayName}
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

export default UserOverlay;
