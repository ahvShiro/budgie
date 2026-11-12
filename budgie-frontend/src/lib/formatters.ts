// Instâncias a nível de módulo, criar Intl a cada render é caro
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
});

const monthLabelFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

// Recebe o LocalDate do backend ("2026-08-04")
export function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(`${date}T00:00:00`));
}

// Recebe um Date (ex: o selecionado no Calendar) e devolve "12 de novembro de 2026"
export function formatLongDate(date: Date) {
  return longDateFormatter.format(date);
}

// Recebe o month do summary ("2026-08") e devolve o rótulo do eixo X ("ago.")
export function formatMonthLabel(month: string) {
  return monthLabelFormatter.format(new Date(`${month}-01T00:00:00`));
}

// Inicial pro AvatarFallback, '?' se o nome vier vazio
export function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}
