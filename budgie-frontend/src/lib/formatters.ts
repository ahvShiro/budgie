// Instâncias a nível de módulo, criar Intl a cada render é caro
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateTime(date: string) {
  return dateTimeFormatter.format(new Date(date));
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });

export function formatMonth(date: Date) {
  return monthFormatter.format(date);
}

// Inicial pro AvatarFallback, '?' se o nome vier vazio
export function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}
