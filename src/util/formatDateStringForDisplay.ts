const formatDateStringForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);

  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date);

  const day = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
  }).format(date);

  const month = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(date);

  const isWeekend = [0, 6].includes(date.getDay());

  return { dayOfWeek, date: day, month, isWeekend };
};

export default formatDateStringForDisplay;
