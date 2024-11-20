import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../components/core/Button';
import Input from '../components/core/Input';
import Separator from '../components/core/Separator';
import { genId } from '../util/genId';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AppDispatch, AppState } from '../store';
import { clearRoom, createRoom, setRoomId } from '../store/roomSlice';
import { clearUser } from '../store/userSlice';
import { toast, ToastContainer } from 'react-toastify';

type StateProps = {
  isLoading: boolean;
};

type DispatchProps = {
  createRoom: (id: string) => Promise<unknown>;
  setRoomId: (id: string) => void;
  clearRoom: () => void;
  clearUser: () => void;
};

type Props = StateProps & DispatchProps;

const attemptToastMap: Record<number, string> = {
  0: 'Try adding Room ID first?',
  1: 'Really?',
  2: 'What are you expecting?',
  3: 'Why are we still here?',
  4: 'Just... why?',
  5: 'Still going strong, huh?',
  6: 'Persistence or stubbornness?',
  7: 'Achievement unlocked: Maximum Attempts',
  8: 'This is getting awkward',
  9: 'You must really like this button',
  10: '🤦‍♂️',
  11: '*slow clap*',
  12: "Legend says they're still clicking",
  13: 'Have you tried turning it off and on again?',
  14: 'Maybe take a coffee break?',
  15: 'Are we having fun yet?',
  25: "🎉 Congratulations! You've unlocked the secret clicking championship!",
  26: '🏆 Your dedication is... concerning but impressive',
  27: '🎸 Never gonna give you up, never gonna let you down...',
  30: '🦄 A wild unicorn appears! It judges you silently.',
  33: '🎨 You could have painted a masterpiece in this time',
  35: '🌟 Achievement Unlocked: Supreme Master of Pointless Clicking',
};

const Home = ({
  isLoading,
  createRoom,
  setRoomId,
  clearRoom,
  clearUser,
}: Props) => {
  const [roomIdValue, setRoomIdValue] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    clearUser();
    clearRoom();
  }, [clearUser, clearRoom]);

  const handleStartPlanning = async () => {
    if (isLoading) return;

    const id = genId();

    await createRoom(id);

    navigate(`/app/${id}`);
  };

  const handleRoomIdChange = (roomId: string) => {
    setRoomIdValue(roomId);
  };

  const handleJoin = () => {
    if (!roomIdValue) {
      let content = attemptToastMap[attemptCount];
      if (!content) {
        content =
          attemptCount > 35
            ? `Attempt #${attemptCount}... I'm not even mad, I'm impressed`
            : `Attempt #${attemptCount}... I'm running out of things to say`;
      }
      toast.error(content);
      setAttemptCount((count) => count + 1);
      return;
    }
    setRoomIdAndNavigate(roomIdValue);
  };

  const setRoomIdAndNavigate = (id: string) => {
    setRoomId(id);
    navigate(`/app/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-stone-400 px-8">
      <ToastContainer />
      <Header />
      <main className="container mx-auto flex h-full flex-1 flex-col justify-center text-center align-middle">
        <div className="mb-4 text-5xl font-extrabold">
          <span className="text-stone-500">Capacity</span>
          <span> made clear</span>
        </div>
        <span>
          Effortlessly plan and optimize your sprints with CapacityCraft. <br />
          Visualize team capacity, collaborate seamlessly, and deliver with
          confidence.
        </span>
        <section className="m-6">
          <Button
            onClick={handleStartPlanning}
            variant={isLoading ? 'loading' : 'default'}
          >
            Start planning
          </Button>
          <Separator />
          <div className="mb-2 font-medium text-stone-800">
            Already have Room ID?
          </div>
          <Input<string>
            className="max-w-full"
            value={roomIdValue}
            onValueChange={handleRoomIdChange}
            name="room-id"
            type="text"
            placeholder="# Room ID"
          />
          <Button onClick={handleJoin}>Join</Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.status.status === 'loading',
});

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  createRoom: (id: string) => dispatch(createRoom(id)),
  setRoomId: (id: string) => dispatch(setRoomId(id)),
  clearRoom: () => dispatch(clearRoom()),
  clearUser: () => dispatch(clearUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
