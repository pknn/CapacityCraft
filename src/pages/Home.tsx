import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../components/core/Button';
import Input from '../components/core/Input';
import Separator from '../components/core/Separator';
import genId from '../util/genId';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AppDispatch } from '../store';
import { clearRoom, setRoomId } from '../store/roomSlice';
import { clearUser } from '../store/userSlice';

type ActionBindings = {
  setRoomId: (id: string) => void;
  clearRoom: () => void;
  clearUser: () => void;
};

type Props = ActionBindings;

const Home = ({ setRoomId, clearRoom, clearUser }: Props) => {
  const [roomIdValue, setRoomIdValue] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    clearUser();
    clearRoom();
  }, [clearUser, clearRoom]);

  const handleStartPlanning = () => {
    const id = genId();
    setRoomIdAndNavigate(id);
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
          <Button onClick={handleStartPlanning}>Start planning</Button>
          <Separator />
          <div className="mb-2 font-medium text-stone-800">
            Already have Room ID?
          </div>
          <Input<string>
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

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  setRoomId: (id: string) => dispatch(setRoomId(id)),
  clearRoom: () => dispatch(clearRoom()),
  clearUser: () => dispatch(clearUser()),
});

export default connect(undefined, mapDispatchToProps)(Home);
