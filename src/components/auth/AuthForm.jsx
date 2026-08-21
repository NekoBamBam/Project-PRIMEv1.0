import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Formulario de autenticación simple: alterna entre "Ingresar" y "Crear cuenta"
 * usando el mismo par de campos email/password.
 */

/* 
futuro google
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Redirige de vuelta a tu app tras autenticar
    },
  });
  if (error) console.error("Error al iniciar sesión con Google:", error.message);
}; */
export default function AuthForm() {
  const { signIn, signUp } = useAuth();

  const [modo, setModo] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setCargando(true);

    try {
      if (modo === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        // Si tu proyecto de Supabase tiene confirmación de email activada,
        // el usuario no queda logueado automáticamente tras el signUp.
        setInfo("Cuenta creada. Revisá tu email para confirmar el registro.");
      }
    } catch (err) {
      setError(err.message ?? "Ocurrió un error. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 rounded-2xl bg-white dark:bg-prime-surface border border-prime-borderLight dark:border-prime-border p-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-prime-gold uppercase mb-1 text-center">
        31 Días para
      </p>
      <h1 className="font-display text-2xl font-bold text-center mb-6 text-prime-ink dark:text-white">
        MI PRIME
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-prime-borderLight dark:border-prime-border
                     bg-transparent px-3 py-2 text-sm text-prime-ink dark:text-white
                     placeholder:text-neutral-400
                     focus:outline-none focus:ring-2 focus:ring-prime-gold"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-prime-borderLight dark:border-prime-border
                     bg-transparent px-3 py-2 text-sm text-prime-ink dark:text-white
                     placeholder:text-neutral-400
                     focus:outline-none focus:ring-2 focus:ring-prime-gold"
        />

        {error && <p className="text-xs text-state-fail">{error}</p>}
        {info && <p className="text-xs text-state-done">{info}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-prime-gold text-prime-ink text-sm font-semibold py-2
                     hover:bg-prime-goldSoft transition-colors disabled:opacity-50"
        >
          {cargando ? "Un momento..." : modo === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setModo(modo === "login" ? "signup" : "login");
          setError("");
          setInfo("");
        }}
        className="w-full text-center text-xs text-neutral-500 dark:text-neutral-400 mt-4 hover:text-prime-gold transition-colors"
      >
        {modo === "login"
          ? "¿No tenés cuenta? Registrate"
          : "¿Ya tenés cuenta? Ingresá"}
      </button>
    </div>
  );
}
