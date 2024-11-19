import { Day } from './Day';
import { Member } from './Member';

export type Room = {
  id: string;
  days: Day[];
  members: Member[];
};
