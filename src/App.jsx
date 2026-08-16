import { useEffect, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useHabits } from "./hooks/useHabits";
import { useHabitLogs } from "./hooks/useHabitLogs";
import { useMonthlyNotes } from "./hooks/useMonthlyNotes";
import { getDaysInMonth, getMonthName } from "./utils/dateUtils";

import AuthForm from "./components/auth/AuthForm";
import LogoutButton from "./components/auth/LogoutButton";
import HabitList from "./components/HabitList";
import HabitTrackerGrid from "./components/HabitTrackerGrid";
import NotesSection from "./components/NotesSection";
import MonthYearSelector from "./components/MonthYearSelector";
import DarkModeToggle from "./components/DarkModeToggle";

const hoy = new Date();

export default function App() {
  const { user, loading: authLoading } = useAuth();

  // El tema (claro/oscuro) sigue siendo preferencia local del navegador,
  // no depende de la cuenta, así que se queda en localStorage.
  const [isDark, setIsDark] = useLocalStorage("prime_dark_mode", true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // El mes/año seleccionado también es preferencia de la sesión del navegador
  // (no hace falta guardarlo en Supabase).
  const [period, setPeriod] = useLocalStorage("prime_selected_period", {
    month: hoy.getMonth(),
    year: hoy.getFullYear(),
  });

  // --- Datos remotos (solo se piden si hay usuario logueado) ---
  const { habits, loading: habitsLoading, addHabit, renameHabit, removeHabit, MAX_HABITS } =
    useHabits(user?.id);

  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);

  const { tracking, loading: logsLoading, toggleCell } = useHabitLogs(
    user?.id,
    habitIds,
    period.month,
    period.year
  );

  const { notes, loading: notesLoading, updateNotes } = useMonthlyNotes(
    user?.id,
    period.month,
    period.year
  );

  const daysInMonth = getDaysInMonth(period.month, period.year);

  // --- Gate de autenticación ---
  if (authLoading) {
    return <PantallaCarga mensaje="Cargando sesión..." />;
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-prime-bgLight dark:bg-prime-bg transition-colors px-4">
        <AuthForm />
      </div>
    );
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
            <LogoutButton />
          </div>
        </header>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Seguimiento de{" "}
          <span className="font-semibold text-prime-gold">
            {getMonthName(period.month)} {period.year}
          </span>{" "}
          — hacé click en cada celda para alternar entre neutro, cumplido y no cumplido.
        </p>

        {/* Layout principal: lista de hábitos + grilla */}
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <HabitList
            habits={habits}
            maxHabits={MAX_HABITS}
            onAdd={addHabit}
            onRename={renameHabit}
            onRemove={removeHabit}
          />

          {habitsLoading || logsLoading ? (
            <PantallaCarga mensaje="Cargando tus hábitos..." inline />
          ) : (
            <HabitTrackerGrid
              habits={habits}
              daysInMonth={daysInMonth}
              month={period.month}
              year={period.year}
              tracking={tracking}
              onToggleCell={toggleCell}
            />
          )}
        </div>

        {/* Notas de reflexión mensual */}
        {!notesLoading && <NotesSection notes={notes} onChange={updateNotes} />}

        <footer className="pt-4 text-center text-xs text-neutral-400">
          Tus datos se sincronizan con tu cuenta en la nube (Supabase).
        </footer>
      </div>
    </div>
  );
}

function PantallaCarga({ mensaje, inline }) {
  const contenido = (
    <p className="text-sm text-neutral-400 animate-pulse">{mensaje}</p>
  );

  if (inline) {
    return (
      <div className="rounded-2xl border border-dashed border-prime-borderLight dark:border-prime-border p-8 text-center">
        {contenido}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-prime-bgLight dark:bg-prime-bg">
      {contenido}
    </div>
  );
}
