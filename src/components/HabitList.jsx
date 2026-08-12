import { useState } from "react";

const MAX_HABITS = 7;

/**
 * Panel de configuración de hábitos. Permite agregar (hasta 7), renombrar
 * y eliminar hábitos. La lista de hábitos es global (no depende del mes),
 * mientras que el estado día a día sí depende del mes/año seleccionado.
 *
 * Props:
 * - habits: [{ id, name }]
 * - onChange: (nuevaListaHabitos) => void
 */
export default function HabitList({ habits, onChange }) {
  const [nuevoHabito, setNuevoHabito] = useState("");

  const puedeAgregar = habits.length < MAX_HABITS;

  function agregarHabito(e) {
    e.preventDefault();
    const nombre = nuevoHabito.trim();
    if (!nombre || !puedeAgregar) return;

    const habitoCreado = { id: crypto.randomUUID(), name: nombre };
    onChange([...habits, habitoCreado]);
    setNuevoHabito("");
  }

  function renombrarHabito(id, nombre) {
    onChange(habits.map((h) => (h.id === id ? { ...h, name: nombre } : h)));
  }

  function eliminarHabito(id) {
    onChange(habits.filter((h) => h.id !== id));
  }

  return (
    <section className="rounded-2xl bg-white dark:bg-prime-surface border border-prime-borderLight dark:border-prime-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg uppercase tracking-wide text-prime-ink dark:text-white">
          Mis Hábitos
        </h2>
        <span className="text-xs font-medium text-prime-gold">
          {habits.length}/{MAX_HABITS}
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
              value={habit.name}
              onChange={(e) => renombrarHabito(habit.id, e.target.value)}
              className="flex-1 min-w-0 rounded-lg border border-prime-borderLight dark:border-prime-border
                         bg-transparent px-3 py-1.5 text-sm text-prime-ink dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-prime-gold"
            />
            <button
              type="button"
              onClick={() => eliminarHabito(habit.id)}
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

      {puedeAgregar ? (
        <form onSubmit={agregarHabito} className="flex gap-2">
          <input
            type="text"
            value={nuevoHabito}
            onChange={(e) => setNuevoHabito(e.target.value)}
            placeholder="Ej: Entrenar, Leer, Meditar..."
            className="flex-1 rounded-lg border border-prime-borderLight dark:border-prime-border
                       bg-transparent px-3 py-2 text-sm text-prime-ink dark:text-white
                       placeholder:text-neutral-400
                       focus:outline-none focus:ring-2 focus:ring-prime-gold"
          />
          <button
            type="submit"
            disabled={!nuevoHabito.trim()}
            className="rounded-lg bg-prime-gold text-prime-ink text-sm font-semibold px-4 py-2
                       hover:bg-prime-goldSoft transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Agregar
          </button>
        </form>
      ) : (
        <p className="text-xs text-neutral-400">
          Alcanzaste el máximo de {MAX_HABITS} hábitos. Eliminá uno para agregar otro.
        </p>
      )}
    </section>
  );
}
