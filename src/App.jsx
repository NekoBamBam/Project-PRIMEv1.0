import { useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getDaysInMonth, getMonthName, getPeriodKey } from "./utils/dateUtils";

import HabitList from "./components/HabitList";
import HabitTrackerGrid from "./components/HabitTrackerGrid";
import NotesSection from "./components/NotesSection";
import MonthYearSelector from "./components/MonthYearSelector";
import DarkModeToggle from "./components/DarkModeToggle";

// Hábitos de ejemplo para que la app no arranque vacía
const HABITOS_INICIALES = [
  { id: crypto.randomUUID(), name: "Entrenar" },
  { id: crypto.randomUUID(), name: "Leer 20 min" },
  { id: crypto.randomUUID(), name: "Dormir 7h+" },
];

const hoy = new Date();

export default function App() {
  // --- Preferencia de tema (claro/oscuro), persistida ---
  const [isDark, setIsDark] = useLocalStorage("prime_dark_mode", true);

  // Aplica/quita la clase "dark" en <html> para que Tailwind (darkMode: 'class') reaccione
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // --- Lista de hábitos (global, no depende del mes) ---
  const [habits, setHabits] = useLocalStorage("prime_habits", HABITOS_INICIALES);

  // --- Período (mes/año) actualmente seleccionado ---
  const [period, setPeriod] = useLocalStorage("prime_selected_period", {
    month: hoy.getMonth(),
    year: hoy.getFullYear(),
  });

  // --- Datos de tracking y notas, organizados por período (clave "YYYY-MM") ---
  // Esto permite llevar el historial de meses anteriores sin que se pisen entre sí.
  const [trackingByPeriod, setTrackingByPeriod] = useLocalStorage("prime_tracking_data", {});
  const [notesByPeriod, setNotesByPeriod] = useLocalStorage("prime_notes_data", {});

  const periodKey = getPeriodKey(period.month, period.year);
  const daysInMonth = getDaysInMonth(period.month, period.year);

  const trackingActual = trackingByPeriod[periodKey] ?? {};
  const notesActual = notesByPeriod[periodKey] ?? { menos: "", mas: "" };

  /**
   * Actualiza el estado de una celda puntual (hábito + día) dentro del período actual,
   * sin tocar los demás períodos guardados.
   */
  function handleToggleCell(habitId, day, nuevoEstado) {
    setTrackingByPeriod((prev) => ({
      ...prev,
      [periodKey]: {
        ...prev[periodKey],
        [habitId]: {
          ...prev[periodKey]?.[habitId],
          [day]: nuevoEstado,
        },
      },
    }));
  }

  function handleNotesChange(nuevasNotas) {
    setNotesByPeriod((prev) => ({ ...prev, [periodKey]: nuevasNotas }));
  }

  return (
    <div className="min-h-screen bg-prime-bgLight dark:bg-prime-bg transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Encabezado */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-prime-gold uppercase mb-1">
              31 Días para
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-prime-ink dark:text-white">
              MI PRIME
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <MonthYearSelector period={period} onChange={setPeriod} />
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </div>
        </header>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Seguimiento de <span className="font-semibold text-prime-gold">
            {getMonthName(period.month)} {period.year}
          </span>{" "}
          — hacé click en cada celda para alternar entre neutro, cumplido y no cumplido.
        </p>

        {/* Layout principal: lista de hábitos + grilla */}
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <HabitList habits={habits} onChange={setHabits} />

          <HabitTrackerGrid
            habits={habits}
            daysInMonth={daysInMonth}
            month={period.month}
            year={period.year}
            tracking={trackingActual}
            onToggleCell={handleToggleCell}
          />
        </div>

        {/* Notas de reflexión mensual */}
        <NotesSection notes={notesActual} onChange={handleNotesChange} />

        <footer className="pt-4 text-center text-xs text-neutral-400">
          Tus datos se guardan automáticamente en este navegador (localStorage).
        </footer>
      </div>
    </div>
  );
}
