import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
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
import ExportTemplate from "./components/ExportTemplate";

const hoy = new Date();

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const exportTemplateRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const [isDark, setIsDark] = useLocalStorage("prime_dark_mode", true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const [period, setPeriod] = useLocalStorage("prime_selected_period", {
    month: hoy.getMonth(),
    year: hoy.getFullYear(),
  });

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

  const handleExportImage = async () => {
    if (!exportTemplateRef.current) return;

    try {
      setIsExporting(true);

      // Le damos un instante para asegurar que la plantilla oculta esté cargada
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(exportTemplateRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
      });

      const link = document.createElement("a");
      link.download = `31-dias-mi-prime-${getMonthName(period.month)}-${period.year}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar la imagen:", err);
    } finally {
      setIsExporting(false);
    }
  };

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
    <div className="min-h-screen bg-prime-bgLight dark:bg-prime-bg transition-colors relative overflow-x-hidden">
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
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              title="Exportar imagen de alta calidad"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-prime-gold text-slate-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isExporting ? "Generando..." : "Exportar"}</span>
            </button>

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

        {/* Layout principal interactivo (vuelve a su estado normal intacto) */}
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

        {!notesLoading && <NotesSection notes={notes} onChange={updateNotes} />}

        <footer className="pt-4 text-center text-xs text-neutral-400">
          Tus datos se sincronizan con tu cuenta en la nube (Supabase).
        </footer>
      </div>

      {/* PLANTILLA OCULTA SOLO PARA EXPORTAR EN ALTA RESOLUCIÓN */}
      <div className="absolute top-0 left-[-9999px] pointer-events-none">
        <ExportTemplate
          ref={exportTemplateRef}
          habits={habits}
          daysInMonth={daysInMonth}
          period={period}
          tracking={tracking}
          notes={notes}
          isDark={isDark}
        />
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