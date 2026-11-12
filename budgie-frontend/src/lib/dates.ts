const pad = (n: number) => n.toString().padStart(2, '0');

export function toLocalDateTimeString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function nowLocalDateTimeString() {
  return toLocalDateTimeString(new Date());
}
