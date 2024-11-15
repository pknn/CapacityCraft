import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/core/Button';
import Input from '../components/core/Input';
import Separator from '../components/core/Separator';
import useRoomState from '../state/useRoomState';
import genId from '../util/genId';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useUserState from '../state/useUserState';

const Home = () => {
  const [roomIdValue, setRoomIdValue] = useState<string>('');
  const setRoomId = useRoomState((state) => state.setRoomId);
  const clearDisplayName = useUserState((state) => state.clearDisplayName);
  const navigate = useNavigate();

  useEffect(() => {
    clearDisplayName();
  }, [clearDisplayName]);

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
    navigate(`/app/${id}/plan`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-stone-400">
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
          <div className="mb-2">Already have Room ID?</div>
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

export default Home;
