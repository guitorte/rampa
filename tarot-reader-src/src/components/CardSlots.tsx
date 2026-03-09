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
        className="touch-target flex-1 flex items-center justify-center gap-1.5 transition-opacity"
        style={{
          borderBottom: "1px dashed rgba(196, 168, 130, 0.2)",
          minHeight: "44px",
          color: "rgba(196, 168, 130, 0.4)",
        }}
      >
        <Plus className="h-3 w-3" />
        <span className="label" style={{ color: "inherit", letterSpacing: "0.12em" }}>
          Carta {slot + 1}
        </span>
      </button>
    );
  }

  const color = getCardColor(card);
  const number = CARD_NUMBERS[card];
  const isMajor = isMajorArcana(card);
  const suit = getCardSuit(card);
  const sublabel = isMajor ? "Maior" : suit ? SUIT_INFO[suit].name : "";

  return (
    <div className="flex-1 relative" style={{ minHeight: "44px" }}>
      <button
        onClick={() => onSlotClick(slot)}
        className="touch-target w-full flex items-center gap-2 px-0 py-2"
      >
        {/* Number glyph */}
        <span
          className="heading-display text-sm font-semibold flex-shrink-0 w-7 text-center"
          style={{ color }}
        >
          {number}
        </span>

        {/* Name */}
        <div className="flex-1 min-w-0 text-left">
          <p
            className="heading-display text-sm font-semibold truncate leading-tight"
            style={{ color: "#ede9e4" }}
          >
            {card}
          </p>
          <p className="label" style={{ color, letterSpacing: "0.1em" }}>
            {sublabel}
          </p>
        </div>
      </button>

      {/* Remove */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemoveCard(slot); }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
        aria-label="Remover carta"
        style={{ color: "#8a8490" }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function CardSlots({ cards, onSlotClick, onRemoveCard }: CardSlotsProps) {
  return (
    <div
      className="flex items-stretch gap-0 px-4 py-0"
      style={{ borderBottom: "1px solid #1e1b26" }}
    >
      {cards.map((card, i) => (
        <div key={i} className="flex-1 flex items-stretch">
          <SlotContent
            card={card}
            slot={i}
            onSlotClick={onSlotClick}
            onRemoveCard={onRemoveCard}
          />
          {/* Divider between slots (not after last) */}
          {i < cards.length - 1 && (
            <div
              className="flex-shrink-0 w-px self-stretch my-3 mx-2"
              style={{ backgroundColor: "#1e1b26" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
