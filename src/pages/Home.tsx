import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../components/core/Button';
import Input from '../components/core/Input';
import Separator from '../components/core/Separator';
import { genRoomId } from '../util/genId';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AppDispatch, AppState } from '../store';
import { clearRoom, createRoom, setRoomId } from '../store/roomSlice';
import { clearUser } from '../store/userSlice';

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

const Home = ({
  isLoading,
  createRoom,
  setRoomId,
  clearRoom,
  clearUser,
}: Props) => {
  const [roomIdValue, setRoomIdValue] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    clearUser();
    clearRoom();
  }, [clearUser, clearRoom]);

  const handleStartPlanning = async () => {
    if (isLoading) return;

    const id = genRoomId();

    await createRoom(id);

    navigate(`/app/${id}`);
  };

  const handleRoomIdChange = (roomId: string) => {
    setRoomIdValue(roomId);
  };

  const handleJoin = () => {
    setRoomIdAndNavigate(roomIdValue);
  };

  const setRoomIdAndNavigate = (id: string) => {
    setRoomId(id);
    navigate(`/app/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-stone-400 px-8">
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
