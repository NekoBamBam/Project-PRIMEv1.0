import { useState, useEffect } from "react";

/**
 * Hook genérico que se comporta como useState pero persiste el valor
 * en localStorage bajo la clave indicada. Sirve para cualquier tipo de
 * dato serializable a JSON (arrays, objetos, strings, etc).
 *
 * @param {string} key - clave de localStorage
 * @param {*} initialValue - valor inicial si no hay nada guardado aún
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (error) {
      // Si localStorage falla (modo privado, cuota excedida, etc.)
      // caemos al valor inicial en vez de romper la app.
      console.warn(`No se pudo leer localStorage["${key}"]`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`No se pudo escribir localStorage["${key}"]`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
