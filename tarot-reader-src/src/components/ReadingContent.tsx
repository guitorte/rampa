import { ArrowLeft, ArrowRight } from "lucide-react";
import { DYNAMICS_INFO, DYNAMICS_ORDER } from "@/data";
import type { DynamicKey } from "@/data";
import type { Combination } from "@/App";

interface ReadingContentProps {
  combination: Combination;
  interaction: Record<DynamicKey, string> | null;
  combinationIndex: number;
  totalCombinations: number;
  onNavigate: (direction: -1 | 1) => void;
}

export function ReadingContent({
  combination,
  interaction,
  combinationIndex,
  totalCombinations,
  onNavigate,
}: ReadingContentProps) {
  const hasPrev = combinationIndex > 0;
  const hasNext = combinationIndex < totalCombinations - 1;

  return (
    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">

      {/* Scrollable reading area */}
      <div key={combination.id} className="flex-1 animate-content">
        {interaction ? (
          <div className="px-5">
            {DYNAMICS_ORDER.map((key, idx) => {
              const info = DYNAMICS_INFO[key];
              const text = interaction[key];

              return (
                <article key={key}>
                  {/* Rule between sections (not before first) */}
                  {idx > 0 && <div className="rule" />}

                  {/* Label row */}
                  <div className="flex items-baseline gap-2 pt-4 pb-3">
                    <span
                      className="label"
                      style={{ color: info.color, letterSpacing: "0.16em" }}
                    >
                      {info.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: `${info.color}70`,
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                      }}
                    >
                      {info.subtitle.toLowerCase()}
                    </span>
                  </div>

                  {/* Body text */}
                  <p
                    className="pb-4 leading-[1.8]"
                    style={{
                      color: "rgba(237, 233, 228, 0.8)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.925rem",
                    }}
                  >
                    {text}
                  </p>
                </article>
              );
            })}
            <div className="h-2" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p style={{ color: "#8a8490", fontSize: "0.875rem" }}>
              Leitura não encontrada.
            </p>
          </div>
        )}
      </div>

      {/* Combination navigation */}
      {totalCombinations > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-3"
          style={{
            borderTop: "1px solid #1e1b26",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)",
          }}
        >
          <button
            onClick={() => onNavigate(-1)}
            disabled={!hasPrev}
            className="touch-target flex items-center gap-1.5 text-xs font-medium"
            style={{ color: hasPrev ? "#c4a882" : "#3a3640" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Anterior
          </button>

          <span className="label">{combinationIndex + 1} de {totalCombinations}</span>

          <button
            onClick={() => onNavigate(1)}
            disabled={!hasNext}
            className="touch-target flex items-center gap-1.5 text-xs font-medium"
            style={{ color: hasNext ? "#c4a882" : "#3a3640" }}
          >
            Próxima
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
