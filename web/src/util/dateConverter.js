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

export function formatTime(timeString) {
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function removeTimezone(dateTimeString) {
  return dateTimeString.replace(/\.\d+|\+\d{2}:\d{2}$/g, '');
}

// from ISO 8601 ("2025-05-02T13:38:14.632520+03:00") to "02.05.2025"
export function getDateFromISOstring(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// from ISO 8601 ('2025-05-02T13:38:14.632520+03:00') to '13:38'
export function getTimeFromISOstring(isoString) {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}