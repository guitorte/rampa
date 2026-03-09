import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Check } from "lucide-react";
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

const CATEGORIES: { id: Category; label: string; cards: string[] }[] = [
  { id: "major",   label: "Arcanos Maiores", cards: MAJOR_ARCANA },
  { id: "copas",   label: "Copas",           cards: COPAS },
  { id: "paus",    label: "Paus",            cards: PAUS },
  { id: "espadas", label: "Espadas",         cards: ESPADAS },
  { id: "ouros",   label: "Ouros",           cards: OUROS },
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
    if (searchQuery.trim()) return searchCards(searchQuery);
    return CATEGORIES.find((c) => c.id === activeCategory)?.cards ?? [];
  }, [activeCategory, searchQuery]);

  const isFull = selectedCards.length >= maxCards;

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <div className="px-5 pt-3 pb-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <p className="label mb-3">Selecionando carta {activeSlot + 1}</p>

        <div className="relative">
          <Search
            className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: "var(--color-muted-foreground)" }}
          />
          <input
            type="text"
            placeholder="Buscar carta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-0 py-2 bg-transparent text-sm focus:outline-none"
            style={{
              borderBottom: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      {!searchQuery.trim() && (
        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="touch-target flex-shrink-0 px-4 py-2.5 text-xs font-medium relative transition-colors"
                style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
              >
                {cat.label}
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
          const sublabel = isMajor ? "Arcano Maior" : suit ? SUIT_INFO[suit].name : "";

          return (
            <button
              key={card}
              onClick={() => { if (!disabled) onSelectCard(card); }}
              disabled={disabled}
              className="touch-target w-full flex items-center gap-3 px-5 py-3 text-left transition-opacity"
              style={{
                opacity: disabled ? 0.25 : 1,
                borderBottom: "1px solid var(--color-secondary)",
              }}
            >
              <span
                className="heading-display text-sm font-semibold flex-shrink-0 w-6 text-center"
                style={{ color }}
              >
                {number}
              </span>

              <div className="flex-1 min-w-0">
                <span
                  className="heading-display text-sm font-semibold truncate block"
                  style={{ color: isSelected ? "var(--color-muted-foreground)" : "var(--color-foreground)" }}
                >
                  {card}
                </span>
                <span className="label" style={{ color }}>{sublabel}</span>
              </div>

              {isSelected && (
                <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--color-foreground)" }} />
              )}
            </button>
          );
        })}

        {displayCards.length === 0 && searchQuery.trim() && (
          <div className="py-10 text-center">
            <p className="label">Nenhuma carta encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
