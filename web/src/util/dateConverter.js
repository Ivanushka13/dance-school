export function createISODate(DateStr, TimeStr) {
  const startDate = new Date(DateStr);
  const startTime = new Date(TimeStr);

  const combinedDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    startTime.getHours(),
    startTime.getMinutes(),
    startTime.getSeconds(),
    startTime.getMilliseconds()
  );

  return combinedDate.toISOString();
}

export function convertDateToUTC(dateString) {
  const date = new Date(dateString);
  
  if (isNaN(date)) {
    throw new Error('Некорректная строка даты');
  }

  return date.toISOString();
}

export function timeToUTC(timeStr) {
  const date = new Date(timeStr);

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function formatDateToDMY(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error("Invalid date string");

  const formatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return formatter.format(date);
}

export function formatTimeToHM(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error("Invalid date string");

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}