import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getCardColor, CARD_NUMBERS } from "@/data";
import type { Combination } from "@/App";

interface CombinationTabsProps {
  combinations: Combination[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function shortName(card: string): string {
  const number = CARD_NUMBERS[card];
  // For minor arcana, show "number + suit initial"
  if (card.includes(" de ")) {
    const suit = card.split(" de ")[1];
    return `${number}${suit[0]}`;
  }
  // For major arcana, truncate name
  return card.length > 12 ? card.slice(0, 10) + "…" : card;
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
      className="flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide"
      style={{ borderBottom: "1px solid #2a1f3d" }}
    >
      {combinations.map((combo, i) => {
        const isActive = i === activeIndex;
        const color1 = getCardColor(combo.card1);
        const color2 = getCardColor(combo.card2);

        return (
          <button
            key={combo.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(i)}
            className={cn(
              "touch-target flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            )}
            style={
              isActive
                ? {
                    backgroundColor: "#a855f7",
                    color: "#0f0a1a",
                    boxShadow: "0 2px 12px rgba(168, 85, 247, 0.25)",
                  }
                : {
                    backgroundColor: "#1e1530",
                    color: "#a8a0b5",
                    border: "1px solid #2a1f3d",
                  }
            }
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: isActive ? "#0f0a1a" : color1 }}
            />
            <span className="truncate max-w-[80px] text-xs">{shortName(combo.card1)}</span>
            <span style={{ opacity: 0.5 }}>×</span>
            <span className="truncate max-w-[80px] text-xs">{shortName(combo.card2)}</span>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: isActive ? "#0f0a1a" : color2 }}
            />
          </button>
        );
      })}
    </div>
  );
}
