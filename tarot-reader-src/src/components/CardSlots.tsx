import { Plus, X } from "lucide-react";
import { CARD_NUMBERS, getCardColor, isMajorArcana, getCardSuit, SUIT_INFO } from "@/data";

interface CardSlotsProps {
  cards: (string | null)[];
  onSlotClick: (slot: number) => void;
  onRemoveCard: (slot: number) => void;
}

function SlotContent({
  card,
  slot,
  onSlotClick,
  onRemoveCard,
}: {
  card: string | null;
  slot: number;
  onSlotClick: (slot: number) => void;
  onRemoveCard: (slot: number) => void;
}) {
  if (!card) {
    return (
      <button
        onClick={() => onSlotClick(slot)}
        className="touch-target flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed transition-colors"
        style={{
          borderColor: "rgba(168, 85, 247, 0.25)",
          backgroundColor: "rgba(168, 85, 247, 0.04)",
          minHeight: "52px",
        }}
      >
        <Plus className="h-4 w-4" style={{ color: "#a855f7" }} />
        <span className="text-[10px] font-medium" style={{ color: "#6b6279" }}>
          Carta {slot + 1}
        </span>
      </button>
    );
  }

  const color = getCardColor(card);
  const number = CARD_NUMBERS[card];
  const isMajor = isMajorArcana(card);
  const suit = getCardSuit(card);
  const label = isMajor ? "Maior" : suit ? SUIT_INFO[suit].name : "";

  return (
    <div
      className="flex-1 relative rounded-xl border transition-colors"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}08`,
        minHeight: "52px",
      }}
    >
      <button
        onClick={() => onSlotClick(slot)}
        className="touch-target w-full h-full flex items-center gap-2 px-2.5 py-2"
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {number || "?"}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold truncate">{card}</p>
          <p className="text-[10px]" style={{ color }}>{label}</p>
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveCard(slot);
        }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(168, 160, 181, 0.15)" }}
        aria-label="Remover carta"
      >
        <X className="h-3 w-3" style={{ color: "#a8a0b5" }} />
      </button>
    </div>
  );
}

export function CardSlots({ cards, onSlotClick, onRemoveCard }: CardSlotsProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2.5"
      style={{ borderBottom: "1px solid #2a1f3d" }}
    >
      {cards.map((card, i) => (
        <SlotContent
          key={i}
          card={card}
          slot={i}
          onSlotClick={onSlotClick}
          onRemoveCard={onRemoveCard}
        />
      ))}
    </div>
  );
}
