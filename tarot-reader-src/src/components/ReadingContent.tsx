import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { DYNAMICS_INFO, DYNAMICS_ORDER } from "@/data";
import type { DynamicKey } from "@/data";

interface ReadingContentProps {
  card1: string;
  card2: string;
  activeDynamic: DynamicKey;
  content: string | null;
  onNavigate: (direction: -1 | 1) => void;
}

export function ReadingContent({
  card1,
  card2,
  activeDynamic,
  content,
  onNavigate,
}: ReadingContentProps) {
  const info = DYNAMICS_INFO[activeDynamic];
  const currentIndex = DYNAMICS_ORDER.indexOf(activeDynamic);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < DYNAMICS_ORDER.length - 1;

  return (
    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
      {/* Dynamic header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-lg leading-none"
            style={{ color: info.color }}
          >
            {info.icon}
          </span>
          <h2
            className="text-xl font-bold"
            style={{ color: info.color, fontFamily: "var(--font-display)" }}
          >
            {info.name}
          </h2>
          <span className="text-xs ml-auto" style={{ color: "#6b6279" }}>
            {currentIndex + 1}/{DYNAMICS_ORDER.length}
          </span>
        </div>
        <p className="text-xs" style={{ color: "#6b6279" }}>
          {info.description}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4">
        {content ? (
          <div
            key={activeDynamic}
            className="animate-content rounded-xl p-4"
            style={{
              backgroundColor: `${info.color}08`,
              borderLeft: `3px solid ${info.color}40`,
            }}
          >
            <div className="flex gap-3">
              <BookOpen
                className="h-4 w-4 flex-shrink-0 mt-1"
                style={{ color: info.color }}
              />
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "#a8a0b5" }}>
                  {card1} → {card2}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(245, 243, 247, 0.9)" }}
                >
                  {content}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm" style={{ color: "#6b6279" }}>
              Leitura não encontrada para esta combinação.
            </p>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          borderTop: "1px solid #2a1f3d",
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)",
        }}
      >
        <button
          onClick={() => onNavigate(-1)}
          disabled={!hasPrev}
          className="touch-target flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            opacity: hasPrev ? 1 : 0.3,
            color: hasPrev ? "#f5f3f7" : "#6b6279",
            backgroundColor: hasPrev ? "#1e1530" : "transparent",
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          {hasPrev && DYNAMICS_INFO[DYNAMICS_ORDER[currentIndex - 1]].name}
        </button>

        {/* Dots indicator */}
        <div className="flex gap-1.5">
          {DYNAMICS_ORDER.map((key, i) => (
            <div
              key={key}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: i === currentIndex ? info.color : "#2a1f3d",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => onNavigate(1)}
          disabled={!hasNext}
          className="touch-target flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            opacity: hasNext ? 1 : 0.3,
            color: hasNext ? "#f5f3f7" : "#6b6279",
            backgroundColor: hasNext ? "#1e1530" : "transparent",
          }}
        >
          {hasNext && DYNAMICS_INFO[DYNAMICS_ORDER[currentIndex + 1]].name}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
