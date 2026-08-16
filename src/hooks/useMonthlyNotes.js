import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getPeriodKey } from "../utils/dateUtils";

/**
 * Reemplaza al antiguo useLocalStorage("prime_notes_data", ...) para el
 * período activo. Carga (o crea implícitamente vía upsert) la fila de
 * monthly_notes correspondiente al período, y aplica debounce al guardado
 * para no pegarle a la base en cada tecla mientras el usuario escribe.
 *
 * Nota sobre columnas: en la tabla real `monthly_notes` no hay columnas
 * separadas de mes/año, sino una sola `year_month` en formato "YYYY-MM"
 * (por eso reutilizamos `getPeriodKey`, que ya arma ese mismo string).
 * Los campos de texto se llaman `do_less` / `do_more`, y el constraint
 * único es (user_id, year_month).
 */
export function useMonthlyNotes(userId, month, year) {
  const [notes, setNotes] = useState({ menos: "", mas: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const yearMonth = getPeriodKey(month, year); // ej: "2026-08"

  const cargarNotas = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("monthly_notes")
      .select("do_less, do_more")
      .eq("user_id", userId)
      .eq("year_month", yearMonth)
      .maybeSingle(); // no rompe si todavía no existe la fila para este mes

    if (error) setError(error.message);
    else setNotes({ menos: data?.do_less ?? "", mas: data?.do_more ?? "" });

    setLoading(false);
  }, [userId, yearMonth]);

  useEffect(() => {
    cargarNotas();
    // Si el usuario cambia de mes mientras había un guardado pendiente,
    // cancelamos ese debounce para no escribir en el período equivocado.
    return () => clearTimeout(debounceRef.current);
  }, [cargarNotas]);

  function updateNotes(nuevasNotas) {
    setNotes(nuevasNotas); // UI responde al instante

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { error } = await supabase.from("monthly_notes").upsert(
        {
          user_id: userId,
          year_month: yearMonth,
          do_less: nuevasNotas.menos,
          do_more: nuevasNotas.mas,
        },
        { onConflict: "user_id,year_month" }
      );
      if (error) setError(error.message);
    }, 600); // 600ms de pausa tras la última tecla antes de guardar
  }

  return { notes, loading, error, updateNotes };
}
