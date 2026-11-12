// Instâncias a nível de módulo, criar Intl a cada render é caro
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(date));
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

// Inicial pro AvatarFallback, '?' se o nome vier vazio
export function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}
