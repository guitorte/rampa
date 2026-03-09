import { useRef, useEffect } from "react";
import type { Combination } from "@/App";

interface CombinationTabsProps {
  combinations: Combination[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function shortName(card: string): string {
  if (card.includes(" de ")) {
    const parts = card.split(" de ");
    return `${parts[0]} ${parts[1][0]}`;
  }
  return card.length > 14 ? card.slice(0, 12) + "…" : card;
}

export function CombinationTabs({ combinations, activeIndex, onSelect }: CombinationTabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

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
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {combinations.map((combo, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            key={combo.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(i)}
            className="touch-target flex-shrink-0 flex flex-col items-start px-4 py-2.5 relative transition-colors"
            style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
          >
            <span
              className="heading-display text-xs font-semibold whitespace-nowrap"
              style={{ fontSize: "0.8rem" }}
            >
              {shortName(combo.card1)}
              <span style={{ opacity: 0.35, margin: "0 0.25em" }}>→</span>
              {shortName(combo.card2)}
            </span>

            {isActive && (
              <span
                className="absolute bottom-0 left-4 right-4 h-px"
                style={{ backgroundColor: "var(--color-foreground)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
