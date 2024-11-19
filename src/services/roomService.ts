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
import { Day } from '../types/Day';

type RoomId = Room['id'];

type RoomService = {
  createRoom: (roomId: RoomId) => Promise<void>;
  getRoom: (roomId: RoomId) => Promise<Room>;
  setDays: (roomId: RoomId, days: Day[]) => Promise<void>;
  addMember: (roomId: RoomId, member: Member) => Promise<void>;
};

type Reference = DocumentReference<DocumentData, DocumentData>;
const roomsCollection = 'rooms';
const getRoomReference = (id: RoomId): Reference =>
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
  setDays: async (roomId, days) => {
    const roomReference = getRoomReference(roomId);
    const room = await roomService.getRoom(roomId);
    const updatedRoom: Room = {
      ...room,
      days,
    };

    await updateDoc(roomReference, updatedRoom);
  },
  addMember: async (roomId: RoomId, member: Member) => {
    const roomReference = getRoomReference(roomId);
    const room = await roomService.getRoom(roomId);
    const updatedRoom: Room = {
      ...room,
      members: [
        ...room.members.filter((member) => member.id !== member.id),
        member,
      ],
    };

    return updateDoc(roomReference, updatedRoom);
  },
};

export default roomService;
