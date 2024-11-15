import { useNavigate, useParams } from 'react-router-dom';
import SprintDetailsInput from '../components/SprintDetailsInput';
import UserOverlay from '../components/UserOverlay';
import { AppDispatch, RootState } from '../store';
import { setRoomId } from '../store/roomSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';

type StateProps = {
  roomId: string | undefined;
};

type DispatchProps = {
  setRoomId: (id: string) => void;
};

type Props = StateProps & DispatchProps;

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

const mapStateToProps = (state: RootState): StateProps => ({
  roomId: state.room.id,
});

const mapDispatchToProsp = (dispatch: AppDispatch): DispatchProps => ({
  setRoomId: (id: string) => dispatch(setRoomId(id)),
});

export default connect(mapStateToProps, mapDispatchToProsp)(Plan);
