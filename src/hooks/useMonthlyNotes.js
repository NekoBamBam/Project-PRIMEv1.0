import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; 

export function useMonthlyNotes(userId, month, year) {
  const [notes, setNotes] = useState({ do_more: "", do_less: "" });
  const [loading, setLoading] = useState(true);

  // Formato estandarizado YYYY-MM (ej: "2026-08")
  const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("monthly_notes")
        .select("*")
        .eq("user_id", userId)
        .eq("year_month", yearMonth)
        .maybeSingle();

      if (isMounted) {
        if (!error && data) {
          setNotes(data);
        } else {
          setNotes({ do_more: "", do_less: "" });
        }
        setLoading(false);
      }
    }

    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, [userId, yearMonth]);

  const updateNotes = async (newNotes) => {
    // 1. Actualización inmediata del estado UI
    setNotes(newNotes);

    if (!userId) return;

    // 2. Preparación del objeto a persistir
    const payload = {
      user_id: userId,
      year_month: yearMonth,
      do_more: newNotes.do_more ?? "",
      do_less: newNotes.do_less ?? "",
      updated_at: new Date().toISOString(),
    };

    // Si ya conocemos el ID del registro, lo adjuntamos para asegurar el UPDATE
    if (newNotes.id) {
      payload.id = newNotes.id;
    }

    const { data, error } = await supabase
      .from("monthly_notes")
      .upsert(payload, { onConflict: "user_id, year_month" })
      .select()
      .single();

    if (error) {
      console.error("Error al guardar en Supabase:", error.message);
    } else if (data) {
      // Actualizamos el estado local con el ID devuelto por Supabase
      setNotes(data);
    }
  };

  return { notes, loading, updateNotes };
}