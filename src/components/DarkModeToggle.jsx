/**
 * Botón simple para alternar entre modo claro y oscuro.
 * El estado real (persistencia + aplicar clase "dark" al <html>) vive en App.jsx.
 *
 * Props:
 * - isDark: boolean
 * - onToggle: () => void
 */
export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Cambiar entre modo claro y oscuro"
      className="rounded-full border border-prime-borderLight dark:border-prime-border
                 h-9 w-9 flex items-center justify-center text-sm
                 text-prime-ink dark:text-white
                 hover:border-prime-gold transition-colors"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
