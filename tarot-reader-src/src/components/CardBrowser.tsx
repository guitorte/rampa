import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAJOR_ARCANA,
  COPAS,
  OUROS,
  PAUS,
  ESPADAS,
  searchCards,
  CARD_NUMBERS,
  SUIT_INFO,
  isMajorArcana,
  getCardSuit,
  getCardColor,
} from "@/data";

type Category = "major" | "copas" | "paus" | "espadas" | "ouros";

const CATEGORIES: { id: Category; label: string; color: string; cards: string[] }[] = [
  { id: "major", label: "Maiores", color: "#a855f7", cards: MAJOR_ARCANA },
  { id: "copas", label: "Copas", color: SUIT_INFO.copas.color, cards: COPAS },
  { id: "paus", label: "Paus", color: SUIT_INFO.paus.color, cards: PAUS },
  { id: "espadas", label: "Espadas", color: SUIT_INFO.espadas.color, cards: ESPADAS },
  { id: "ouros", label: "Ouros", color: SUIT_INFO.ouros.color, cards: OUROS },
];

interface CardBrowserProps {
  selectedCards: string[];
  onSelectCard: (card: string) => void;
  maxCards: number;
  activeSlot: number;
}

export function CardBrowser({ selectedCards, onSelectCard, maxCards, activeSlot }: CardBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("major");
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, 0);
  }, [activeCategory]);

  const displayCards = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCards(searchQuery);
    }
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat ? cat.cards : [];
  }, [activeCategory, searchQuery]);

  const isFull = selectedCards.length >= maxCards;

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Slot indicator */}
      <div className="px-4 pb-2">
        <p className="text-xs font-medium" style={{ color: "#a8a0b5" }}>
          Selecionando carta {activeSlot + 1} de {maxCards}
        </p>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "#a8a0b5" }}
          />
          <input
            type="text"
            placeholder="Buscar carta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1"
            style={{
              backgroundColor: "#1e1530",
              borderColor: "#2a1f3d",
              color: "#f5f3f7",
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      {!searchQuery.trim() && (
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "touch-target flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                )}
                style={
                  isActive
                    ? { backgroundColor: cat.color, color: "#0f0a1a" }
                    : { backgroundColor: "#1e1530", color: "#a8a0b5" }
                }
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Card list */}
      <div ref={listRef} className="flex-1 overflow-y-auto min-h-0">
        {displayCards.map((card) => {
          const isSelected = selectedCards.includes(card);
          const disabled = !isSelected && isFull;
          const number = CARD_NUMBERS[card];
          const color = getCardColor(card);
          const suit = getCardSuit(card);
          const isMajor = isMajorArcana(card);
          const subtitle = isMajor ? "Arcano Maior" : suit ? SUIT_INFO[suit].name : "";

          return (
            <button
              key={card}
              onClick={() => {
                if (!disabled) {
                  onSelectCard(card);
                }
              }}
              disabled={disabled}
              className={cn(
                "touch-target w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                disabled && "opacity-30",
                isSelected && "opacity-50",
              )}
              style={{
                borderBottom: "1px solid rgba(42, 31, 61, 0.5)",
              }}
            >
              {/* Number badge */}
              <span
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                }}
              >
                {number || "?"}
              </span>

              {/* Name & subtitle */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">{card}</span>
                <span className="text-xs block" style={{ color: "#6b6279" }}>{subtitle}</span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: "#0f0a1a" }} />
                </span>
              )}
            </button>
          );
        })}

        {displayCards.length === 0 && searchQuery.trim() && (
          <div className="text-center py-8 text-sm" style={{ color: "#a8a0b5" }}>
            Nenhuma carta encontrada
          </div>
        )}
      </div>
    </div>
  );
}
