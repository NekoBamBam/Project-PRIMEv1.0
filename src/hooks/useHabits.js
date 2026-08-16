import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MAX_HABITS = 7;

export function useHabits(userId) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function mapRow(row) {
    return { id: row.id, name: row.title, position: row.position };
  }

  const cargarHabitos = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("habits")
      .select("id, title, position")
      .eq("user_id", userId)
      .order("position", { ascending: true });

    if (error) setError(error.message);
    else setHabits((data ?? []).map(mapRow));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    cargarHabitos();
  }, [cargarHabitos]);

 async function addHabit(name) {
    const nombre = name.trim();
    if (!nombre || habits.length >= MAX_HABITS) return;

    if (!userId) {
      setError("No hay usuario activo.");
      return;
    }

    // Inserción directa enviando un objeto limpio
    const { data, error } = await supabase
      .from("habits")
      .insert({
        title: nombre,
        position: habits.length,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase:", error);
      setError(error.message);
      return;
    }

    setHabits((prev) => [...prev, mapRow(data)]);
  }

  async function renameHabit(id, name) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name } : h)));
    const { error } = await supabase
      .from("habits")
      .update({ title: name })
      .eq("id", id);
    if (error) setError(error.message);
  }

  async function removeHabit(id) {
    const anterior = habits;
    setHabits((prev) => prev.filter((h) => h.id !== id));

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) {
      setError(error.message);
      setHabits(anterior);
    }
  }

  return {
    habits,
    loading,
    error,
    addHabit,
    renameHabit,
    removeHabit,
    MAX_HABITS,
  };
}
