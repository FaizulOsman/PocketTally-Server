export const getBDTime = (): { time: string; date: string } => {
  const d: Date = new Date();
  const utc: number = d.getTime() + d.getTimezoneOffset() * 60000;
  const nd: Date = new Date(utc + 3600000 * 6);

  // Get day, month, and year
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const date: string = nd.toLocaleDateString('en-US', options);

  // Get time
  const time: string = nd.toLocaleTimeString('en-US');

  return { time, date: new Date(date).toDateString() };
};
