import { db } from '../firebase';
import { Room } from '../types/Room';
import {
  doc,
  setDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';

type RoomService = {
  createRoom: (room: Room) => Promise<void>;
};

const roomsCollection = 'rooms';
const getRoomReference = (
  id: Room['id']
): DocumentReference<DocumentData, DocumentData> =>
  doc(db, roomsCollection, id);

const roomService = {
  createRoom: async (room) => {
    const roomReference = getRoomReference(room.id);
    return setDoc(roomReference, room);
  },
} satisfies RoomService;

export default roomService;
