import { isToday } from "../utils/dateUtils";

// Ciclo de estados de cada celda al hacer click: neutro -> cumplido -> no cumplido -> neutro
const CICLO_ESTADOS = ["neutral", "done", "fail"];

// Clases Tailwind por estado (soportan light y dark mode)
const ESTILOS_CELDA = {
  neutral:
    "bg-state-neutralLight dark:bg-state-neutral/60 border-prime-borderLight dark:border-prime-border",
  done: "bg-state-done border-state-done text-white",
  fail: "bg-state-fail border-state-fail text-white",
};

/**
 * Devuelve el próximo estado en el ciclo neutro -> cumplido -> no cumplido -> neutro.
 */
function siguienteEstado(actual) {
  const index = CICLO_ESTADOS.indexOf(actual ?? "neutral");
  return CICLO_ESTADOS[(index + 1) % CICLO_ESTADOS.length];
}

/**
 * Matriz interactiva: filas = hábitos (hasta 7), columnas = días del mes (hasta 31).
 * Cada celda alterna su estado al hacer click.
 *
 * Props:
 * - habits: [{ id, name }]
 * - daysInMonth: number
 * - month, year: número de mes (0-11) y año, para resaltar la columna de "hoy"
 * - tracking: { [habitId]: { [day]: 'neutral' | 'done' | 'fail' } } — SOLO del período actual
 * - onToggleCell: (habitId, day, nuevoEstado) => void — recibe ya calculado el próximo estado del ciclo
 */
export default function HabitTrackerGrid({
  habits,
  daysInMonth,
  month,
  year,
  tracking,
  onToggleCell,
}) {
  const dias = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-prime-borderLight dark:border-prime-border p-8 text-center text-sm text-neutral-400">
        Agregá al menos un hábito para empezar a trackear el mes.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-prime-surface border border-prime-borderLight dark:border-prime-border overflow-hidden">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              {/* Celda vacía sobre los nombres de hábito, sticky en el scroll horizontal */}
              <th className="sticky left-0 z-10 bg-white dark:bg-prime-surface p-3 text-left w-40 min-w-[10rem]" />
              {dias.map((day) => (
                <th
                  key={day}
                  className={`p-1 text-[11px] font-semibold w-8 min-w-[2rem] text-center
                    ${
                      isToday(day, month, year)
                        ? "text-prime-gold"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                >
                  {day}
                </th>
              ))}
              <th className="p-2 text-[11px] font-semibold text-neutral-400 w-14 min-w-[3.5rem] text-center">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const filaHabito = tracking[habit.id] ?? {};
              const cumplidos = Object.values(filaHabito).filter((s) => s === "done").length;
              const porcentaje = Math.round((cumplidos / daysInMonth) * 100);

              return (
                <tr key={habit.id} className="border-t border-prime-borderLight dark:border-prime-border">
                  <td
                    className="sticky left-0 z-10 bg-white dark:bg-prime-surface p-3 text-sm font-medium
                               text-prime-ink dark:text-white truncate max-w-[10rem]"
                    title={habit.name}
                  >
                    {habit.name || "(sin nombre)"}
                  </td>
                  {dias.map((day) => {
                    const estado = filaHabito[day] ?? "neutral";
                    return (
                      <td key={day} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleCell(habit.id, day, siguienteEstado(estado))}
                          aria-label={`${habit.name}, día ${day}, estado ${estado}`}
                          className={`h-6 w-6 rounded-md border transition-colors duration-150
                                      hover:brightness-95 active:scale-95
                                      ${ESTILOS_CELDA[estado]}
                                      ${isToday(day, month, year) ? "ring-1 ring-prime-gold" : ""}`}
                        />
                      </td>
                    );
                  })}
                  <td className="p-2 text-center text-xs font-semibold text-prime-gold">
                    {porcentaje}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Leyenda de colores */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-prime-borderLight dark:border-prime-border text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-state-neutralLight dark:bg-state-neutral/60 border border-prime-borderLight dark:border-prime-border" />
          Neutro
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-state-done" /> Cumplido
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-state-fail" /> No cumplido
        </span>
      </div>
    </div>
  );
}
