import { connect } from 'react-redux';
import pushToClipboard from '../util/pushToClipboard';
import { AppState } from '../store';
import Logo from './Logo';
import { roomSelector } from '../store/roomSlice';
import { useEffect, useState } from 'react';

type Props = {
  roomId: string | undefined;
  displayName: string | undefined;
};

const Header = ({ roomId, displayName }: Props) => {
  const [copyContentMessage, setCopyContentMessage] = useState(
    'Copy link to clipboard'
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setCopyContentMessage('Room Link Copied!');
      setTimeout(() => {
        setCopyContentMessage('Copy link to clipboard');
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  const handleRoomIdClick = () => {
    pushToClipboard(location.href);
    setCopied(true);
  };

  return (
    <header className="container mx-auto flex max-w-screen-lg items-center justify-between py-4">
      <Logo />
      {displayName && roomId ? (
        <span className="group font-medium">
          {displayName}{' '}
          <span
            className="relative cursor-pointer text-stone-400 group-hover:text-stone-500 group-hover:*:block"
            onClick={handleRoomIdClick}
          >
            #{roomId}
            <div className="absolute left-0 top-full text-xs opacity-0 transition-all duration-300 group-hover:opacity-100">
              {copyContentMessage}
            </div>
          </span>
        </span>
      ) : null}
    </header>
  );
};

const mapStateToProps = (state: AppState): Props => ({
  roomId: roomSelector.value(state).id,
  displayName: state.user.displayName,
});

export default connect(mapStateToProps)(Header);
