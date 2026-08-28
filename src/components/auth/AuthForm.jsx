import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

/* FUTURO GOOGLE 
import { supabase } from "../supabaseClient"; // o tu cliente supabase

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin, // Redirige de vuelta a tu app
    },
  });
  if (error) console.error("Error iniciando sesión con Google:", error.message);
};

// En tu JSX:
<button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
  Iniciar sesión con Google
</button>
 */

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
