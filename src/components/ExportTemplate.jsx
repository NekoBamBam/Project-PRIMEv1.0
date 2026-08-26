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

  // Normalizador defensivo para capturar hacerMenos / do_less / doLess (sea Array o String)
  const parseLista = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return data.split("\n").filter(Boolean);
    return [];
  };

  const hacerMenosList = parseLista(notes?.hacerMenos || notes?.do_less || notes?.doLess);
  const hacerMasList = parseLista(notes?.hacerMas || notes?.do_more || notes?.doMore);

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
          {hacerMenosList.length > 0 ? (
            <ul className="space-y-1 text-xs opacity-90">
              {hacerMenosList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span>{typeof item === "object" ? item.text || item.name : item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs opacity-50 italic">Sin registros este mes...</p>
          )}
        </div>

        {/* HACER MÁS */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            HACER MÁS
          </h3>
          {hacerMasList.length > 0 ? (
            <ul className="space-y-1 text-xs opacity-90">
              {hacerMasList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>{typeof item === "object" ? item.text || item.name : item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs opacity-50 italic">Sin registros este mes...</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ExportTemplate;