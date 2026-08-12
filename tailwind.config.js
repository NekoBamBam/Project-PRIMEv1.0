/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode controlado manualmente vía clase "dark" en <html>
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta "PRIME": grafito profundo + acento dorado (disciplina/logro)
        prime: {
          bg: "#0B0E11",          // fondo principal (dark)
          surface: "#12161B",      // tarjetas/paneles (dark)
          surfaceLight: "#F7F5F1", // tarjetas/paneles (light)
          bgLight: "#EFEDE8",      // fondo principal (light)
          border: "#242A31",
          borderLight: "#DEDAD2",
          gold: "#C9A44C",         // acento principal
          goldSoft: "#E4C97A",
          ink: "#1A1D21",
        },
        state: {
          done: "#3C8A5C",     // verde apagado = cumplido
          doneLight: "#EAF4EE",
          fail: "#B5484A",     // rojo apagado = no cumplido
          failLight: "#FBEAEA",
          neutral: "#3A3F45",  // gris = neutro (dark)
          neutralLight: "#DEDBD4", // gris = neutro (light)
        },
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
