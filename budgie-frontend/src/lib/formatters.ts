// Instâncias a nível de módulo, criar Intl a cada render é caro
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

const monthLabelFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

// Recebe o LocalDate do backend ("2026-08-04")
export function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(`${date}T00:00:00`));
}

// Recebe o month do summary ("2026-08") e devolve o rótulo do eixo X ("ago.")
export function formatMonthLabel(month: string) {
  return monthLabelFormatter.format(new Date(`${month}-01T00:00:00`));
}
