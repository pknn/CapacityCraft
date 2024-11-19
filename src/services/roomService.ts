import { db } from '../firebase';
import { Room } from '../types/Room';
import {
  doc,
  setDoc,
  DocumentReference,
  DocumentData,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { generateDays } from '../util/dayGenerator';
import formatDateInput from '../util/formatDateInput';
import { Member } from '../types/Member';

type RoomId = Room['id'];

type RoomService = {
  createRoom: (roomId: RoomId) => Promise<void>;
  getRoom: (roomId: RoomId) => Promise<Room>;
  addMember: (roomId: RoomId, member: Member) => Promise<void>;
};

const roomsCollection = 'rooms';
const getRoomReference = (
  id: RoomId
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
  getRoom: async (roomId) => {
    const roomReference = getRoomReference(roomId);
    const doc = await getDoc(roomReference);
    return doc.data() as Room;
  },
  addMember: async (roomId: RoomId, member: Member) => {
    const roomReference = getRoomReference(roomId);
    const room = await roomService.getRoom(roomId);
    const updatedRoom: Room = {
      ...room,
      members: [...room.members, member],
    };

    return updateDoc(roomReference, updatedRoom);
  },
};

export default roomService;
