# 31 Días para MI PRIME — Tracker de Hábitos (MVP)

MVP de seguimiento de hábitos diarios: hasta 7 hábitos, grilla mensual de 31
días, estados neutro/cumplido/no cumplido, notas de "Hacer Menos" / "Hacer
Más" y modo claro/oscuro. Todo se persiste en `localStorage`.

## Instalación

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  components/
    HabitList.jsx          Alta/baja/edición de hábitos (máx. 7)
    HabitTrackerGrid.jsx    Grilla 31 días x N hábitos, celdas cíclicas
    NotesSection.jsx        Notas "Hacer Menos" / "Hacer Más"
    MonthYearSelector.jsx   Selector de mes y año
    DarkModeToggle.jsx      Switch de tema claro/oscuro
  hooks/
    useLocalStorage.js      Hook genérico de persistencia
  utils/
    dateUtils.js            Helpers de fechas (días del mes, período, etc.)
  App.jsx                   Orquesta el estado global
```

## Próximos pasos sugeridos

- Exportar/importar datos como JSON (backup manual).
- Reordenar hábitos con drag & drop.
- Vista de resumen histórico (comparar meses).
- Migrar de localStorage a un backend cuando deje de ser MVP.
