import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
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
      {/* Pair header */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs font-medium" style={{ color: "#6b6279" }}>
          {combination.card1} → {combination.card2}
          {totalCombinations > 1 && (
            <span className="ml-2">
              ({combinationIndex + 1}/{totalCombinations})
            </span>
          )}
        </p>
      </div>

      {/* All 5 dynamics stacked vertically */}
      <div
        key={combination.id}
        className="flex-1 px-4 pb-4 space-y-3 animate-content"
      >
        {interaction ? (
          DYNAMICS_ORDER.map((key) => {
            const info = DYNAMICS_INFO[key];
            const text = interaction[key];

            return (
              <section
                key={key}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: `${info.color}06`,
                  border: `1px solid ${info.color}15`,
                }}
              >
                {/* Dynamic header */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    borderBottom: `1px solid ${info.color}12`,
                    backgroundColor: `${info.color}08`,
                  }}
                >
                  <span className="text-base leading-none" style={{ color: info.color }}>
                    {info.icon}
                  </span>
                  <h3
                    className="text-base font-bold"
                    style={{ color: info.color, fontFamily: "var(--font-display)" }}
                  >
                    {info.name}
                  </h3>
                  <span className="text-[10px] ml-1" style={{ color: `${info.color}80` }}>
                    {info.subtitle}
                  </span>
                </div>

                {/* Dynamic content */}
                <div className="px-4 py-3">
                  <div className="flex gap-3">
                    <BookOpen
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: `${info.color}60` }}
                    />
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(245, 243, 247, 0.85)" }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              </section>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm" style={{ color: "#6b6279" }}>
              Leitura nao encontrada para esta combinacao.
            </p>
          </div>
        )}
      </div>

      {/* Bottom navigation for combinations */}
      {totalCombinations > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-2.5"
          style={{
            borderTop: "1px solid #2a1f3d",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 10px)",
          }}
        >
          <button
            onClick={() => onNavigate(-1)}
            disabled={!hasPrev}
            className="touch-target flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium"
            style={{
              opacity: hasPrev ? 1 : 0.3,
              color: hasPrev ? "#f5f3f7" : "#6b6279",
              backgroundColor: hasPrev ? "#1e1530" : "transparent",
            }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalCombinations }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: i === combinationIndex ? "#a855f7" : "#2a1f3d",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => onNavigate(1)}
            disabled={!hasNext}
            className="touch-target flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium"
            style={{
              opacity: hasNext ? 1 : 0.3,
              color: hasNext ? "#f5f3f7" : "#6b6279",
              backgroundColor: hasNext ? "#1e1530" : "transparent",
            }}
          >
            Proxima
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
