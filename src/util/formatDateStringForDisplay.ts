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

  return { dayOfWeek, date: day, month };
};

export default formatDateStringForDisplay;
