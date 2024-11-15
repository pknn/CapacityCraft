import useRoomState from '../state/useRoomState';
import useUserState from '../state/useUserState';
import Logo from './Logo';

const Header = () => {
  const displayName = useUserState((state) => state.displayName);
  const roomId = useRoomState((state) => state.roomId);

  return (
    <header className="container mx-auto flex max-w-screen-lg items-center justify-between py-4">
      <Logo />
      {displayName && roomId ? (
        <span className="font-medium">
          {displayName}{' '}
          <span className="group relative cursor-pointer text-stone-400 hover:text-stone-500 group-hover:*:block">
            #{roomId}
            <div className="absolute left-0 top-full mt-1 cursor-pointer opacity-0 transition-all duration-300 group-hover:opacity-100">
              Copy link to clipboard
            </div>
          </span>
        </span>
      ) : null}
    </header>
  );
};

export default Header;
