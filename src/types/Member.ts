import { Day } from './Day';

export type Member = {
  id: string;
  displayName: string | undefined;
  days: Day[];
  isManual: boolean;
};
