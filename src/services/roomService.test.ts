import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import roomService from './roomService';
import { db } from '../firebase';
import { Room } from '../types/Room';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase/firestore';

// Mock Firebase modules
vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

describe('roomService', () => {
  const mockRoomId = 'test-room-123';
  const mockRoom: Room = {
    id: mockRoomId,
    days: [],
    members: [],
    baselineVelocity: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a new room with generated days', async () => {
      const mockRef = {} as DocumentReference;
      (doc as unknown as Mock).mockReturnValue(mockRef);
      (setDoc as unknown as Mock).mockResolvedValue(undefined);

      const result = await roomService.createRoom(mockRoomId);

      expect(doc).toHaveBeenCalledWith(db, 'rooms', mockRoomId);
      expect(setDoc).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: mockRoomId,
        members: [],
        baselineVelocity: 0,
      });
      expect(result.days).toBeDefined();
      expect(Array.isArray(result.days)).toBe(true);
    });
  });

  describe('getRoom', () => {
    it('should retrieve an existing room', async () => {
      const mockRef = {} as DocumentReference;
      const mockSnapshot = {
        data: () => mockRoom,
      } as unknown as DocumentSnapshot;

      (doc as unknown as Mock).mockReturnValue(mockRef);
      (getDoc as unknown as Mock).mockResolvedValue(mockSnapshot);

      const result = await roomService.getRoom(mockRoomId);

      expect(doc).toHaveBeenCalledWith(db, 'rooms', mockRoomId);
      expect(getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockRoom);
    });

    it('should reject if room does not exist', async () => {
      const mockRef = {} as DocumentReference;
      const mockSnapshot = {
        data: () => ({ id: null }),
      } as unknown as DocumentSnapshot;

      (doc as unknown as Mock).mockReturnValue(mockRef);
      (getDoc as unknown as Mock).mockResolvedValue(mockSnapshot);

      await expect(roomService.getRoom(mockRoomId)).rejects.toEqual(undefined);
    });
  });

  describe('updateRoom', () => {
    it('should update an existing room', async () => {
      const update = { baselineVelocity: 5 };
      const updatedRoom = { ...mockRoom, ...update };
      const mockRef = {} as DocumentReference;
      const mockSnapshot = {
        data: () => mockRoom,
      } as unknown as DocumentSnapshot;

      (doc as unknown as Mock).mockReturnValue(mockRef);
      (getDoc as unknown as Mock).mockResolvedValue(mockSnapshot);
      (updateDoc as unknown as Mock).mockResolvedValue(undefined);

      const result = await roomService.updateRoom(mockRoomId, update);

      expect(doc).toHaveBeenCalledWith(db, 'rooms', mockRoomId);
      expect(updateDoc).toHaveBeenCalled();
      expect(result).toEqual(updatedRoom);
    });
  });

  describe('subscribe', () => {
    it('should set up subscription and call onChange when room exists', () => {
      const mockOnChange = vi.fn();
      const mockOnError = vi.fn();
      const mockUnsubscribe = vi.fn();
      const mockRef = {} as DocumentReference;

      (doc as unknown as Mock).mockReturnValue(mockRef);
      (onSnapshot as unknown as Mock).mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          data: () => mockRoom,
        } as unknown as DocumentSnapshot);
        return mockUnsubscribe;
      });

      const unsubscribe = roomService.subscribe(
        mockRoomId,
        mockOnChange,
        mockOnError
      );

      expect(doc).toHaveBeenCalledWith(db, 'rooms', mockRoomId);
      expect(mockOnChange).toHaveBeenCalledWith(mockRoom);
      expect(mockOnError).not.toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call onError when room does not exist', () => {
      const mockOnChange = vi.fn();
      const mockOnError = vi.fn();
      const mockUnsubscribe = vi.fn();
      const mockRef = {} as DocumentReference;

      (doc as unknown as Mock).mockReturnValue(mockRef);
      (onSnapshot as unknown as Mock).mockImplementation((ref, callback) => {
        callback({
          exists: () => false,
          data: () => null,
        } as unknown as DocumentSnapshot);
        return mockUnsubscribe;
      });

      const unsubscribe = roomService.subscribe(
        mockRoomId,
        mockOnChange,
        mockOnError
      );

      expect(doc).toHaveBeenCalledWith(db, 'rooms', mockRoomId);
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(mockRoomId);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
