import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardTabsProps {
  selectedCards: string[];
  activeCardIndex: number;
  onTabChange: (index: number) => void;
  onRemoveCard: (card: string) => void;
}

export function CardTabs({
  selectedCards,
  activeCardIndex,
  onTabChange,
  onRemoveCard,
}: CardTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeCardIndex]);

  if (selectedCards.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide"
      style={{
        backgroundColor: "#0a0a0f",
        borderBottom: "1px solid #27273a",
      }}
    >
      {selectedCards.map((card, index) => {
        const isActive = index === activeCardIndex;
        return (
          <button
            key={card}
            ref={isActive ? activeTabRef : undefined}
            onClick={() => onTabChange(index)}
            className={cn(
              "touch-target flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            )}
            style={
              isActive
                ? { backgroundColor: "#a78bfa", color: "#0a0a0f" }
                : { backgroundColor: "#1e1e2e", color: "#a1a1aa", border: "1px solid #27273a" }
            }
          >
            <span className="truncate max-w-[120px]">{card}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCard(card);
              }}
              className="flex-shrink-0 p-0.5 rounded-full hover:opacity-80"
              style={{
                backgroundColor: isActive ? "rgba(10, 10, 15, 0.2)" : "rgba(167, 139, 250, 0.2)",
              }}
            >
              <X className="h-3 w-3" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
