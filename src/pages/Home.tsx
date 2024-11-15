import { useState } from 'react';
import Button from '../components/core/Button';
import Input from '../components/core/Input';
import Logo from '../components/Logo';
import Separator from '../components/core/Separator';
import useRoomState from '../state/useRoomState';
import { useShallow } from 'zustand/shallow';

const Home = () => {
  const [roomIdValue, setRoomIdValue] = useState<string>('');
  const { generateRoomId, setRoomId } = useRoomState(
    useShallow((state) => ({
      generateRoomId: state.generateRoomId,
      setRoomId: state.setRoomId,
    }))
  );

  const handleStartPlanning = () => {
    generateRoomId();
  };

  const handleRoomIdChange = (roomId: string) => {
    setRoomIdValue(roomId);
  };

  const handleJoin = () => {
    setRoomId(roomIdValue);
  };

  return (
    <div className="bg-gradient-to-b from-white to-stone-400 min-h-screen flex flex-col">
      <header className="flex px-6 py-4">
        <Logo />
      </header>
      <main className="container mx-auto text-center flex flex-col align-middle h-full flex-1 justify-center">
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
            placeholder="# Room ID"
          />
          <Button onClick={handleJoin}>Join</Button>
        </section>
      </main>
      <footer className="text-center py-4 text-sm text-stone-500">
        <div>© 2024 Capacity Craft</div>
      </footer>
    </div>
  );
};

export default Home;
