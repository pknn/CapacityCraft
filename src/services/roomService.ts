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
import formatDate from '../util/formatDateInput';
import { DocumentSnapshot } from 'firebase/firestore/lite';

type RoomId = Room['id'];

type RoomService = {
  createRoom: (roomId: RoomId) => Promise<Room>;
  getRoom: (roomId: RoomId) => Promise<Room>;
  updateRoom: (roomId: RoomId, update: Partial<Room>) => Promise<Room>;
  subscribe: (
    roomId: RoomId,
    onChange: (room: Room) => void,
    onError: (roomId: string) => void
  ) => () => void;
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
      days: generateDays(formatDate(new Date()), [], 11),
      members: [],
      baselineVelocity: 0,
    };
    await setDoc(roomReference, room);
    return room;
  },
  getRoom: async (roomId) => {
    const roomReference = getRoomReference(roomId);
    const doc = await getDoc(roomReference);
    const room = doc.data() as Room;

    if (!room.id) return Promise.reject();

    return room;
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
  subscribe: (roomId, onChange, onError) => {
    const roomReference = getRoomReference(roomId);
    return onSnapshot(roomReference, (snapshot: DocumentSnapshot) => {
      if (snapshot.exists()) {
        const room = snapshot.data() as Room;
        onChange(room);
      } else {
        onError(roomId);
      }
    });
  },
};

export default roomService;
