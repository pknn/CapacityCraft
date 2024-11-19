import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import SprintDetails from '../components/SprintDetails';
import UserOverlay from '../components/UserOverlay';
import { AppDispatch } from '../store';
import { fetchRoomAndSet } from '../store/roomSlice';
import Calendar from '../components/Calendar/Calendar';
import Legend from '../components/Calendar/Legend';
import { clearMember } from '../store/membersSlice';

type ActionBindings = {
  setRoomId: (id: string) => void;
  clearMembers: () => void;
};

type Props = ActionBindings;

const Plan = ({ setRoomId, clearMembers }: Props) => {
  const navigate = useNavigate();
  const { roomId: roomIdFromParam } = useParams();

  useEffect(() => {
    if (!roomIdFromParam) {
      navigate('/');
    }
  }, [navigate, roomIdFromParam]);

  useEffect(() => {
    setRoomId(roomIdFromParam ?? '');
  }, [roomIdFromParam, setRoomId]);

  useEffect(() => {
    clearMembers();
  }, [clearMembers]);

  return (
    <>
      <UserOverlay />
      <SprintDetails />
      <Legend />
      <Calendar />
    </>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch): ActionBindings => ({
  setRoomId: (id: string) => dispatch(fetchRoomAndSet(id)),
  clearMembers: () => dispatch(clearMember()),
});

export default connect(undefined, mapDispatchToProps)(Plan);
