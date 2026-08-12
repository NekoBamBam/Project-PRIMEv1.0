import { getMonthOptions } from "../utils/dateUtils";

/**
 * Selector combinado de Mes y Año.
 * Cambia qué "período" (mes-año) se está mostrando en la grilla y las notas,
 * ya que cada mes guarda su propia matriz de hábitos independiente.
 *
 * Props:
 * - period: { month: number (0-11), year: number }
 * - onChange: (nuevoPeriod) => void
 */
export default function MonthYearSelector({ period, onChange }) {
  const meses = getMonthOptions();
  // Rango de años razonable: 3 hacia atrás, 1 hacia adelante desde hoy
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i);

  return (
    <div className="flex items-center gap-3">
      <select
        aria-label="Mes"
        value={period.month}
        onChange={(e) => onChange({ ...period, month: Number(e.target.value) })}
        className="rounded-lg border bg-white dark:bg-prime-surface
                   border-prime-borderLight dark:border-prime-border
                   text-sm font-medium px-3 py-2
                   text-prime-ink dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-prime-gold"
      >
        {meses.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Año"
        value={period.year}
        onChange={(e) => onChange({ ...period, year: Number(e.target.value) })}
        className="rounded-lg border bg-white dark:bg-prime-surface
                   border-prime-borderLight dark:border-prime-border
                   text-sm font-medium px-3 py-2
                   text-prime-ink dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-prime-gold"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
