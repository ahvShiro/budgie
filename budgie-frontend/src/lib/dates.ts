const pad = (n: number, size = 2) => n.toString().padStart(size, '0');

export function toLocalDateTimeString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

export function nowLocalDateTimeString() {
  return toLocalDateTimeString(new Date());
}
