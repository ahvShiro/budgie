const pad = (n: number) => n.toString().padStart(2, '0');

export function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// T00:00:00 sem 'Z' faz o Date nascer meia-noite no fuso local
export function parseLocalDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function todayLocalDateString() {
  return toLocalDateString(new Date());
}
