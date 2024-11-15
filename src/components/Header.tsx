import useRoomState from '../state/useRoomState';
import useUserState from '../state/useUserState';
import pushToClipboard from '../util/pushToClipboard';
import Logo from './Logo';

const Header = () => {
  const displayName = useUserState((state) => state.displayName);
  const roomId = useRoomState((state) => state.roomId);

  const handleRoomClick = () => {
    pushToClipboard(location.href);
  };

  return (
    <header
      onClick={handleRoomClick}
      className="group container mx-auto flex max-w-screen-lg cursor-pointer items-center justify-between py-4"
    >
      <Logo />
      {displayName && roomId ? (
        <span className="font-medium">
          {displayName}{' '}
          <span className="relative text-stone-400 group-hover:text-stone-500 group-hover:*:block">
            #{roomId}
            <div className="absolute left-0 top-full text-xs opacity-0 transition-all duration-300 group-hover:opacity-100">
              Copy link to clipboard!
            </div>
          </span>
        </span>
      ) : null}
    </header>
  );
};

export default Header;
