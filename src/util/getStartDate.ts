import { Day } from '../types/Day';

const getStartDate = (days: Day[]): string =>
  [...days].sort((a, b) => (new Date(a.date) < new Date(b.date) ? -1 : 1))[0]
    .date;

export default getStartDate;
