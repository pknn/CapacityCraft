import { db } from '../firebase';
import { Room } from '../types/Room';
import {
  doc,
  setDoc,
  DocumentReference,
  DocumentData,
  updateDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { generateDays } from '../util/dayGenerator';
import formatDateInput from '../util/formatDateInput';
import { DocumentSnapshot } from 'firebase/firestore/lite';

type RoomId = Room['id'];

type RoomService = {
  createRoom: (roomId: RoomId) => Promise<Room>;
  getRoom: (roomId: RoomId) => Promise<Room>;
  updateRoom: (roomId: RoomId, update: Partial<Room>) => Promise<Room>;
  subscribe: (roomId: RoomId, onChange: (room: Room) => void) => () => void;
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
    await setDoc(roomReference, room);
    return room;
  },
  getRoom: async (roomId) => {
    const roomReference = getRoomReference(roomId);
    const doc = await getDoc(roomReference);
    return doc.data() as Room;
  },
  updateRoom: async (roomId, update) => {
    const roomReference = getRoomReference(roomId);
    const room = await roomService.getRoom(roomId);

    const updatedRoom: Room = {
      ...room,
      ...update,
    };
    await updateDoc(roomReference, updatedRoom);
    return updatedRoom;
  },
  subscribe: (roomId, onChange) => {
    const roomReference = getRoomReference(roomId);
    return onSnapshot(roomReference, (snapshot: DocumentSnapshot) => {
      if (snapshot.exists()) {
        const room = snapshot.data() as Room;
        onChange(room);
      }
    });
  },
};

export default roomService;
