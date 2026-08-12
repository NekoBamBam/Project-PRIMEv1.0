/**
 * Dos cuadros de texto libre para la reflexión mensual, estilo "31 Días para MI PRIME":
 * qué cosas reducir ("Hacer Menos") y qué cosas potenciar ("Hacer Más").
 *
 * Props:
 * - notes: { menos: string, mas: string }
 * - onChange: (nuevasNotas) => void
 */
export default function NotesSection({ notes, onChange }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <NoteCard
        label="Hacer Menos"
        accent="border-state-fail"
        value={notes.menos}
        placeholder="Ej: procrastinar, redes sociales de noche, quejarme..."
        onChange={(menos) => onChange({ ...notes, menos })}
      />
      <NoteCard
        label="Hacer Más"
        accent="border-state-done"
        value={notes.mas}
        placeholder="Ej: leer 20 min, entrenar, planificar el día..."
        onChange={(mas) => onChange({ ...notes, mas })}
      />
    </section>
  );
}

function NoteCard({ label, accent, value, placeholder, onChange }) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-prime-surface border-l-4 ${accent}
                  border-t border-r border-b border-prime-borderLight dark:border-prime-border p-4`}
    >
      <h3 className="font-display text-sm uppercase tracking-wide mb-2 text-prime-ink dark:text-white">
        {label}
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-prime-borderLight dark:border-prime-border
                   bg-transparent px-3 py-2 text-sm text-prime-ink dark:text-white
                   placeholder:text-neutral-400
                   focus:outline-none focus:ring-2 focus:ring-prime-gold"
      />
    </div>
  );
}
