import { forwardRef } from "react";
import { getMonthName } from "../utils/dateUtils";

const ExportTemplate = forwardRef(function ExportTemplate(
  { habits, daysInMonth, period, tracking, notes, isDark },
  ref
) {
  const bgClass = isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900";
  const cardBg = isDark ? "bg-[#161f38] border-slate-700/50" : "bg-slate-50 border-slate-200";
  const cellEmpty = isDark ? "bg-slate-700/50" : "bg-slate-200";
  const textColor = isDark ? "text-slate-100" : "text-slate-800";

  // Función ultra-defensiva para extraer texto o listas de cualquier formato posible
  const renderizarContenido = (campoEsp, campoIng, campoDb) => {
    // Buscamos el valor en cualquiera de las propiedades probables
    const valor = notes?.[campoEsp] ?? notes?.[campoIng] ?? notes?.[campoDb];

    if (!valor) return <p className="text-xs opacity-50 italic">Sin registros este mes...</p>;

    // Caso A: Si es una cadena de texto (ej: un textarea con saltos de línea)
    if (typeof valor === "string") {
      if (!valor.trim()) return <p className="text-xs opacity-50 italic">Sin registros este mes...</p>;
      
      const lineas = valor.split("\n").filter((l) => l.trim() !== "");
      return (
        <ul className="space-y-1 text-xs opacity-90">
          {lineas.map((linea, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span>•</span>
              <span>{linea}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Caso B: Si es un Arreglo (ej: [{ text: '...' }] o ['...'])
    if (Array.isArray(valor)) {
      if (valor.length === 0) return <p className="text-xs opacity-50 italic">Sin registros este mes...</p>;

      return (
        <ul className="space-y-1 text-xs opacity-90">
          {valor.map((item, idx) => {
            const textoItem = typeof item === "object" ? item?.text || item?.name || item?.content || JSON.stringify(item) : item;
            return (
              <li key={idx} className="flex items-start gap-1.5">
                <span>•</span>
                <span>{textoItem}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return <p className="text-xs opacity-50 italic">Sin registros este mes...</p>;
  };

  return (
    <div
      ref={ref}
      style={{ width: "1160px" }}
      className={`p-8 ${bgClass} space-y-6 font-sans`}
    >
      {/* Encabezado del Template */}
      <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
            31 Días para
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">MI PRIME</h1>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-amber-400">
            {getMonthName(period.month)} {period.year}
          </p>
          <p className="text-xs opacity-60">Plantilla de Seguimiento</p>
        </div>
      </div>

      {/* Grilla compacta de Hábitos */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="w-full">
          {/* Fila de números de día */}
          <div className="flex items-center mb-3">
            <div className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider opacity-70">
              HÁBITO
            </div>
            <div
              className="flex-1 grid gap-1 text-center"
              style={{
                gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <div key={day} className="text-[11px] font-semibold opacity-70">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Filas de Hábitos */}
          <div className="space-y-3">
            {habits && habits.length > 0 ? (
              habits.map((habit) => {
                const habitLabel = habit.name || habit.title || habit.nombre || "Sin nombre";

                return (
                  <div key={habit.id} className="flex items-center">
                    <div className={`w-36 shrink-0 text-xs font-semibold truncate pr-3 ${textColor}`}>
                      {habitLabel}
                    </div>
                    <div
                      className="flex-1 grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const status = tracking?.[habit.id]?.[day] || "neutral";
                        let statusBg = cellEmpty;

                        if (status === "done" || status === "completed") {
                          statusBg = "bg-emerald-500";
                        } else if (status === "fail" || status === "failed") {
                          statusBg = "bg-rose-500";
                        }

                        return (
                          <div
                            key={day}
                            className={`h-6 rounded-md ${statusBg} flex items-center justify-center`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-2">No hay hábitos agregados aún.</p>
            )}
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 mt-6 pt-3 border-t border-slate-700/30 text-[11px] opacity-70">
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${cellEmpty}`} />
              <span>Neutro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Cumplido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span>No cumplido</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas de Reflexión */}
      <div className="grid grid-cols-2 gap-4">
       {/* HACER MENOS */}
<div className={`p-4 rounded-xl border ${cardBg}`}>
  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
    HACER MENOS
  </h3>
  {notes?.do_less ? (
    <p className="text-xs min-h-[50px] whitespace-pre-wrap opacity-90">
      {notes.do_less}
    </p>
  ) : (
    <p className="text-xs opacity-50 italic">Sin registros este mes...</p>
  )}
</div>

{/* HACER MÁS */}
<div className={`p-4 rounded-xl border ${cardBg}`}>
  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
    HACER MÁS
  </h3>
  {notes?.do_more ? (
    <p className="text-xs min-h-[50px] whitespace-pre-wrap opacity-90">
      {notes.do_more}
    </p>
  ) : (
    <p className="text-xs opacity-50 italic">Sin registros este mes...</p>
  )}
</div>
      </div>
    </div>
  );
});

export default ExportTemplate;