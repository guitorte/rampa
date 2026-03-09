import { Plus, X, ArrowRight } from "lucide-react";
import { CARD_NUMBERS, getCardColor, isMajorArcana, getCardSuit, SUIT_INFO } from "@/data";

interface CardSlotsProps {
  card1: string | null;
  card2: string | null;
  onSlotClick: (slot: 0 | 1) => void;
  onRemoveCard: (slot: 0 | 1) => void;
  isReading: boolean;
}

function SlotContent({
  card,
  slot,
  onSlotClick,
  onRemoveCard,
  compact,
}: {
  card: string | null;
  slot: 0 | 1;
  onSlotClick: (slot: 0 | 1) => void;
  onRemoveCard: (slot: 0 | 1) => void;
  compact: boolean;
}) {
  if (!card) {
    return (
      <button
        onClick={() => onSlotClick(slot)}
        className="touch-target flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors"
        style={{
          borderColor: "rgba(168, 85, 247, 0.3)",
          backgroundColor: "rgba(168, 85, 247, 0.05)",
          minHeight: compact ? "56px" : "80px",
        }}
      >
        <Plus className="h-5 w-5" style={{ color: "#a855f7" }} />
        <span className="text-xs font-medium" style={{ color: "#a8a0b5" }}>
          Carta {slot + 1}
        </span>
      </button>
    );
  }

  const color = getCardColor(card);
  const number = CARD_NUMBERS[card];
  const isMajor = isMajorArcana(card);
  const suit = getCardSuit(card);
  const label = isMajor ? "Arcano Maior" : suit ? SUIT_INFO[suit].name : "";

  return (
    <div
      className="flex-1 relative rounded-xl border transition-colors"
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}08`,
        minHeight: compact ? "56px" : "80px",
      }}
    >
      <button
        onClick={() => onSlotClick(slot)}
        className="touch-target w-full h-full flex items-center gap-3 px-3 py-2"
      >
        <span
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {number || "?"}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold truncate">{card}</p>
          {!compact && (
            <p className="text-xs" style={{ color: color }}>{label}</p>
          )}
        </div>
      </button>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveCard(slot);
        }}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "rgba(168, 160, 181, 0.15)",
        }}
        aria-label="Remover carta"
      >
        <X className="h-3 w-3" style={{ color: "#a8a0b5" }} />
      </button>
    </div>
  );
}

export function CardSlots({ card1, card2, onSlotClick, onRemoveCard, isReading }: CardSlotsProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3"
      style={{ borderBottom: "1px solid #2a1f3d" }}
    >
      <SlotContent
        card={card1}
        slot={0}
        onSlotClick={onSlotClick}
        onRemoveCard={onRemoveCard}
        compact={isReading}
      />

      {/* Connection */}
      <div className="flex-shrink-0 flex items-center justify-center w-8">
        <ArrowRight
          className="h-4 w-4 pulse-soft"
          style={{ color: card1 && card2 ? "#a855f7" : "#2a1f3d" }}
        />
      </div>

      <SlotContent
        card={card2}
        slot={1}
        onSlotClick={onSlotClick}
        onRemoveCard={onRemoveCard}
        compact={isReading}
      />
    </div>
  );
}
