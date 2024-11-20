const isWeekend = (date: Date): boolean => [0, 6].includes(date.getDay());

export default isWeekend;
