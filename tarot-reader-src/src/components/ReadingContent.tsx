import { useRef, useState, useEffect, useCallback } from "react";
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
  tabsVisible?: boolean;
}

export function ReadingContent({
  combination,
  interaction,
  combinationIndex,
  totalCombinations,
  onNavigate,
  tabsVisible = true,
}: ReadingContentProps) {
  const hasPrev = combinationIndex > 0;
  const hasNext = combinationIndex < totalCombinations - 1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDynamic, setActiveDynamic] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  // Scroll to top when combination changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [combination.id]);

  // IntersectionObserver for sticky header (show when heading scrolls out)
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [combination.id]);

  // IntersectionObserver for active dynamic tracking
  const dynamicRefs = useRef<(HTMLElement | null)[]>([]);
  const setDynamicRef = useCallback((el: HTMLElement | null, idx: number) => {
    dynamicRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = dynamicRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveDynamic(idx);
          }
        }
      },
      { root: container, threshold: 0.5 },
    );
    dynamicRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [combination.id, interaction]);

  function scrollToDynamic(idx: number) {
    dynamicRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col relative" ref={scrollRef}>
      {/* Sticky combination indicator — appears when heading scrolls out of view */}
      {showStickyHeader && !tabsVisible && (
        <div
          className="sticky top-0 z-10 px-5 py-2 backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span className="heading-display text-sm font-semibold">
            {combination.card1}
            <span style={{ opacity: 0.4, margin: "0 0.25em", fontSize: "0.85em" }}>sobre</span>
            {combination.card2}
          </span>
        </div>
      )}

      <div key={combination.id} className="flex-1 animate-content">
        {interaction ? (
          <div className="px-5 reading-column">
            <div ref={headingRef} className="pt-6 pb-4">
              <h2
                className="heading-display"
                style={{ fontSize: "1.3rem" }}
              >
                {combination.card1}
                <span style={{ opacity: 0.4, margin: "0 0.3em", fontSize: "0.85em" }}>sobre</span>
                {combination.card2}
              </h2>
            </div>
            {DYNAMICS_ORDER.map((key, idx) => {
              const info = DYNAMICS_INFO[key];
              const text = interaction[key];

              return (
                <article
                  key={key}
                  id={`dynamic-${key}`}
                  ref={(el) => setDynamicRef(el, idx)}
                >
                  {idx > 0 && <div className="rule" />}

                  <div className="flex items-baseline gap-2 pt-5 pb-3">
                    <span
                      className="label"
                      style={{ color: info.color, letterSpacing: "0.16em" }}
                    >
                      {info.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: info.color,
                        opacity: 0.5,
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                      }}
                    >
                      {info.subtitle.toLowerCase()}
                    </span>
                  </div>

                  <p
                    className="pb-5 leading-[1.8]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.95rem",
                      color: "rgba(26, 26, 26, 0.75)",
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
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.875rem" }}>
              Leitura não encontrada.
            </p>
          </div>
        )}
      </div>

      {/* Dynamic mini-nav — floating dots for jumping between dynamics */}
      {interaction && (
        <div className="dynamic-mini-nav">
          {DYNAMICS_ORDER.map((key, idx) => {
            const info = DYNAMICS_INFO[key];
            const isActive = idx === activeDynamic;
            return (
              <button
                key={key}
                onClick={() => scrollToDynamic(idx)}
                aria-label={info.name}
                title={info.name}
                className="dynamic-mini-nav-dot"
                style={{
                  backgroundColor: isActive ? info.color : "var(--color-muted)",
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "8px" : "6px",
                }}
              />
            );
          })}
        </div>
      )}

      {totalCombinations > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-3 md:hidden"
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)",
          }}
        >
          <button
            onClick={() => onNavigate(-1)}
            disabled={!hasPrev}
            className="touch-target flex items-center gap-1.5 text-xs font-medium"
            style={{
              color: hasPrev ? "var(--color-foreground)" : "var(--color-muted)",
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Anterior
          </button>

          <span className="label">{combinationIndex + 1} de {totalCombinations}</span>

          <button
            onClick={() => onNavigate(1)}
            disabled={!hasNext}
            className="touch-target flex items-center gap-1.5 text-xs font-medium"
            style={{
              color: hasNext ? "var(--color-foreground)" : "var(--color-muted)",
            }}
          >
            Próxima
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
