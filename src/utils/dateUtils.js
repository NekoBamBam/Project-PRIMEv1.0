// Utilidades de fecha usadas por el selector de Mes/Año y la grilla de hábitos.

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/**
 * Devuelve la cantidad de días que tiene un mes/año dado (28-31).
 * @param {number} month - mes en formato 0-11 (como Date de JS)
 * @param {number} year
 */
export function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Devuelve el nombre del mes en español dado su índice 0-11.
 */
export function getMonthName(month) {
  return MESES[month];
}

export function getMonthOptions() {
  return MESES.map((nombre, index) => ({ value: index, label: nombre }));
}

/**
 * Clave única "YYYY-MM" usada para namespacing en localStorage,
 * así cada mes guarda su propia matriz de hábitos.
 */
export function getPeriodKey(month, year) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/**
 * Construye una fecha ISO "YYYY-MM-DD" para un día puntual del período,
 * tal como la espera la columna `log_date` (date) de Supabase.
 */
export function toISODate(day, month, year) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * Indica si (day, month, year) corresponde a la fecha de hoy,
 * para resaltar la columna del día actual en la grilla.
 */
export function isToday(day, month, year) {
  const hoy = new Date();
  return (
    day === hoy.getDate() &&
    month === hoy.getMonth() &&
    year === hoy.getFullYear()
  );
}
