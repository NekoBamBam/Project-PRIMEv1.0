import { useState } from "react";

/**
 * Panel de configuración de hábitos. Permite agregar (hasta maxHabits),
 * renombrar y eliminar hábitos.
 *
 * Props:
 * - habits: [{ id, name }]
 * - maxHabits: number
 * - onAdd: (name) => void
 * - onRename: (id, name) => void
 * - onRemove: (id) => void
 */
export default function HabitList({ habits = [], maxHabits, onAdd, onRename, onRemove }) {
  const [nuevoHabito, setNuevoHabito] = useState("");

  const puedeAgregar = habits.length < maxHabits;

  function agregarHabito(e) {
    e.preventDefault();
    if (!nuevoHabito.trim() || !puedeAgregar) return;
    onAdd(nuevoHabito.trim());
    setNuevoHabito("");
  }

  return (
    <section className="rounded-2xl bg-white dark:bg-prime-surface border border-prime-borderLight dark:border-prime-border p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg uppercase tracking-wide text-prime-ink dark:text-white">
            Mis Hábitos
          </h2>
          <span className="text-xs font-medium text-prime-gold">
            {habits.length}/{maxHabits}
          </span>
        </div>

        <ul className="space-y-2 mb-4">
          {habits.map((habit, index) => (
            <li key={habit.id} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs text-center font-semibold text-neutral-400 dark:text-neutral-500">
                {index + 1}
              </span>
              <input
                type="text"
                value={habit.name || habit.title || ""}
                onChange={(e) => onRename(habit.id, e.target.value)}
                className="flex-1 min-w-0 rounded-lg border border-prime-borderLight dark:border-prime-border
                           bg-transparent px-3 py-1.5 text-sm text-prime-ink dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-prime-gold"
              />
              <button
                type="button"
                onClick={() => onRemove(habit.id)}
                aria-label={`Eliminar hábito ${habit.name}`}
                className="shrink-0 text-neutral-400 hover:text-state-fail transition-colors px-1"
              >
                ✕
              </button>
            </li>
          ))}
          {habits.length === 0 && (
            <p className="text-sm text-neutral-400 italic">
              Todavía no agregaste hábitos. Sumá el primero abajo.
            </p>
          )}
        </ul>
      </div>

      {/* Formulario ordenado abajo en columna o flex wrap para pantallas chicas */}
      {puedeAgregar ? (
        <form onSubmit={agregarHabito} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-prime-borderLight dark:border-prime-border">
          <input
            type="text"
            value={nuevoHabito}
            onChange={(e) => setNuevoHabito(e.target.value)}
            placeholder="Ej: Entrenar, Leer..."
            className="flex-1 min-w-0 rounded-lg border border-prime-borderLight dark:border-prime-border
                       bg-transparent px-3 py-2 text-sm text-prime-ink dark:text-white
                       placeholder:text-neutral-400
                       focus:outline-none focus:ring-2 focus:ring-prime-gold"
          />
          <button
            type="submit"
            disabled={!nuevoHabito.trim()}
            className="shrink-0 rounded-lg bg-prime-gold text-prime-ink text-sm font-semibold px-4 py-2
                       hover:bg-prime-goldSoft transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Agregar
          </button>
        </form>
      ) : (
        <p className="text-xs text-neutral-400 pt-2 border-t border-prime-borderLight dark:border-prime-border">
          Alcanzaste el máximo de {maxHabits} hábitos. Eliminá uno para agregar otro.
        </p>
      )}
    </section>
  );
}