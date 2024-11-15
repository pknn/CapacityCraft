import { useNavigate, useParams } from 'react-router-dom';
import SprintDetailsInput from '../components/SprintDetailsInput';
import UserOverlay from '../components/UserOverlay';
import { AppDispatch, AppState } from '../store';
import { setRoomId } from '../store/roomSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';

type ActionBindings = {
  roomId: string | undefined;
};

type ActionBindings = {
  setRoomId: (id: string) => void;
};

type Props = ActionBindings & ActionBindings;

const Plan = ({ roomId, setRoomId }: Props) => {
  const navigate = useNavigate();
  const { roomId: roomIdFromParam } = useParams();

  useEffect(() => {
    if (!roomIdFromParam) {
      navigate('/');
    }
    if (!roomId) {
      setRoomId(roomIdFromParam ?? '');
    }
  }, [roomId, setRoomId, roomIdFromParam, navigate]);

  return (
    <div>
      <UserOverlay />
      <h1 className="text-lg font-extrabold">Plan</h1>
      <SprintDetailsInput />
    </div>
  );
};

const mapStateToProps = (state: AppState): ActionBindings => ({
  roomId: state.room.id,
});

const mapDispatchToProsp = (dispatch: AppDispatch): ActionBindings => ({
  setRoomId: (id: string) => dispatch(setRoomId(id)),
});

export default connect(mapStateToProps, mapDispatchToProsp)(Plan);
