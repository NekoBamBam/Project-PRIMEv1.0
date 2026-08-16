import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toISODate, getDaysInMonth } from "../utils/dateUtils";

export function useHabitLogs(userId, habitIds, month, year) {
  const [tracking, setTracking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysInMonth = getDaysInMonth(month, year);
  const habitIdsKey = habitIds.join(",");

  const cargarLogs = useCallback(async () => {
    if (!userId || habitIds.length === 0) {
      setTracking({});
      setLoading(false);
      return;
    }
    setLoading(true);

    const primerDia = toISODate(1, month, year);
    const ultimoDia = toISODate(daysInMonth, month, year);

    const { data, error } = await supabase
      .from("habit_logs")
      .select("habit_id, date, status")
      .eq("user_id", userId)
      .in("habit_id", habitIds)
      .gte("date", primerDia)
      .lte("date", ultimoDia);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const nuevoTracking = {};
    for (const fila of data) {
      const dia = Number(fila.date.slice(-2));
      nuevoTracking[fila.habit_id] ??= {};
      nuevoTracking[fila.habit_id][dia] = fila.status;
    }

    setTracking(nuevoTracking);
    setLoading(false);
  }, [userId, habitIdsKey, month, year, daysInMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  async function toggleCell(habitId, day, nuevoEstado) {
    // Guard explícito: sin userId, el upsert viajaría con user_id
    // undefined/null. Cortamos acá en vez de mandarlo a Supabase.
    if (!userId) {
      setError("No se pudo guardar: no hay una sesión de usuario activa todavía.");
      return;
    }

    const estadoAnterior = tracking[habitId]?.[day];

    setTracking((prev) => ({
      ...prev,
      [habitId]: { ...prev[habitId], [day]: nuevoEstado },
    }));

    const formattedDate = toISODate(day, month, year);

    const { error } = await supabase.from("habit_logs").upsert(
      {
        user_id: userId,
        habit_id: habitId,
        date: formattedDate,
        status: nuevoEstado,
      },
      { onConflict: "habit_id,date" }
    );

    if (error) {
      setError(error.message);
      // Revertimos la actualización optimista si Supabase rechazó el upsert.
      setTracking((prev) => ({
        ...prev,
        [habitId]: { ...prev[habitId], [day]: estadoAnterior },
      }));
    }
  }

  return { tracking, loading, error, toggleCell };
}