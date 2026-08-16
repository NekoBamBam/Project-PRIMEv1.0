import { useAuth } from "../../context/AuthContext";

/**
 * Botón de logout. Muestra el email del usuario actual como referencia rápida.
 */
export default function LogoutButton() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
        {user?.email}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="rounded-full border border-prime-borderLight dark:border-prime-border
                   px-3 py-1.5 text-xs font-medium text-prime-ink dark:text-white
                   hover:border-prime-gold transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
