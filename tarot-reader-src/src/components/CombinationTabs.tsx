import { useRef, useEffect } from "react";
import { CARD_NUMBERS } from "@/data";
import type { Combination } from "@/App";

interface CombinationTabsProps {
  combinations: Combination[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function shortName(card: string): string {
  // "2 de Copas" → "2C", "O Mago" → "O Mago", "Rainha de Espadas" → "RE"
  if (card.includes(" de ")) {
    const parts = card.split(" de ");
    return `${parts[0]} ${parts[1][0]}`;
  }
  return card.length > 14 ? card.slice(0, 12) + "…" : card;
}

export function CombinationTabs({ combinations, activeIndex, onSelect }: CombinationTabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null);
  void CARD_NUMBERS; // used indirectly via shortName

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div
      className="flex overflow-x-auto scrollbar-hide"
      style={{ borderBottom: "1px solid #1e1b26" }}
    >
      {combinations.map((combo, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            key={combo.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(i)}
            className="touch-target flex-shrink-0 flex flex-col items-start px-4 py-2.5 relative transition-colors"
            style={{ color: isActive ? "#ede9e4" : "#8a8490" }}
          >
            <span
              className="heading-display text-xs font-semibold whitespace-nowrap"
              style={{ fontSize: "0.8rem" }}
            >
              {shortName(combo.card1)}
              <span style={{ opacity: 0.4, margin: "0 0.3em" }}>×</span>
              {shortName(combo.card2)}
            </span>

            {/* Active underline */}
            {isActive && (
              <span
                className="absolute bottom-0 left-4 right-4 h-px"
                style={{ backgroundColor: "#c4a882" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
