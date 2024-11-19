import { db } from '../firebase';
import { Room } from '../types/Room';
import {
  doc,
  setDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { generateDays } from '../util/dayGenerator';
import formatDateInput from '../util/formatDateInput';

type RoomService = {
  createRoom: (roomId: Room['id']) => Promise<void>;
};

const roomsCollection = 'rooms';
const getRoomReference = (
  id: Room['id']
): DocumentReference<DocumentData, DocumentData> =>
  doc(db, roomsCollection, id);

const roomService: RoomService = {
  createRoom: async (roomId) => {
    const roomReference = getRoomReference(roomId);
    const room: Room = {
      id: roomId,
      days: generateDays(formatDateInput(new Date()), [], 9),
      members: [],
    };
    return setDoc(roomReference, room);
  },
};

export default roomService;
