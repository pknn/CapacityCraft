import { useNavigate, useParams } from 'react-router-dom';
import SprintDetailsInput from '../components/SprintDetailsInput';
import UserOverlay from '../components/UserOverlay';
import { AppDispatch, AppState } from '../store';
import { setRoomId } from '../store/roomSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import Calendar from '../components/Calendar/Calendar';

type StateBindings = {
  roomId: string | undefined;
};

type ActionBindings = {
  setRoomId: (id: string) => void;
};

type Props = StateBindings & ActionBindings;

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
      <SprintDetailsInput />
      <Calendar />
    </div>
  );
};

const mapStateToProps = (state: AppState): StateBindings => ({
  roomId: state.room.id,
});

const mapDispatchToProsp = (dispatch: AppDispatch): ActionBindings => ({
  setRoomId: (id: string) => dispatch(setRoomId(id)),
});

export default connect(mapStateToProps, mapDispatchToProsp)(Plan);
