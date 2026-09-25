import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: number;
  tone?: "income" | "expense";
  // Contagem não é dinheiro, então não passa pelo formatador de moeda
  format?: "currency" | "count";
}

export const Stat = ({ label, value, tone, format = "currency" }: StatProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span
      className={cn(
        "text-2xl font-bold",
        tone === "income" && "text-income",
        tone === "expense" && "text-expense"
      )}
    >
      {format === "currency" ? formatCurrency(value) : value}
    </span>
  </div>
);
