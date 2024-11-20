import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import SprintDetails from '../components/SprintDetails';
import UserOverlay from '../components/UserOverlay';
import { AppDispatch } from '../store';
import Calendar from '../components/Calendar/Calendar';
import Legend from '../components/Calendar/Legend';
import { clearMember } from '../store/membersSlice';
import { syncDown } from '../store/dataThunkActions';
import roomService from '../services/roomService';
import { Room } from '../types/Room';
import { toast } from 'react-toastify';

type ActionBindings = {
  syncDown: (id: string) => void;
  syncDownSubscribed: (room: Room) => void;
  clearMembers: () => void;
};

type Props = ActionBindings;

const Plan = ({ syncDown, syncDownSubscribed, clearMembers }: Props) => {
  const navigate = useNavigate();
  const { roomId: roomIdFromParam } = useParams();

  const handleSubscribeError = useCallback(
    (roomId: string) => {
      toast.error(
        <div className="text-sm text-stone-700">
          Cannot find room{' '}
          <span className="font-mono text-stone-600">#{roomId}</span>
          <br />
          Bringing you back home
        </div>,
        {
          autoClose: 5000,
        }
      );
      setTimeout(() => {
        navigate('/');
      }, 6000);
    },
    [navigate]
  );

  useEffect(() => {
    if (!roomIdFromParam) {
      navigate('/');
    }
  }, [navigate, roomIdFromParam]);

  useEffect(() => {
    syncDown(roomIdFromParam ?? '');
    const unsubscribe = roomService.subscribe(
      roomIdFromParam ?? '',
      syncDownSubscribed,
      handleSubscribeError
    );
    return () => {
      unsubscribe();
    };
  }, [roomIdFromParam, syncDown, syncDownSubscribed]);

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
  syncDown: (id: string) => dispatch(syncDown(id)),
  syncDownSubscribed: (room: Room) =>
    dispatch(syncDown.fulfilled(room, '', room.id)),
  clearMembers: () => dispatch(clearMember()),
});

export default connect(undefined, mapDispatchToProps)(Plan);
