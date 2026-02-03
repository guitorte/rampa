import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCardNames,
  MAJOR_ARCANA,
  CARD_NUMBERS,
  COPAS,
  OUROS,
  PAUS,
  ESPADAS,
  getCardSuit,
  SUIT_INFO,
} from "@/data";

type Filter = "all" | "major" | "copas" | "ouros" | "paus" | "espadas";

const FILTERS: { id: Filter; label: string; color?: string }[] = [
  { id: "all", label: "Todas" },
  { id: "major", label: "Arcanos Maiores", color: "#a78bfa" },
  { id: "copas", label: "Copas", color: "#3b82f6" },
  { id: "ouros", label: "Ouros", color: "#eab308" },
  { id: "paus", label: "Paus", color: "#ef4444" },
  { id: "espadas", label: "Espadas", color: "#a1a1aa" },
];

interface CardSelectorProps {
  selectedCards: string[];
  onSelectCard: (card: string) => void;
  maxCards?: number;
}

export function CardSelector({
  selectedCards,
  onSelectCard,
  maxCards = 3,
}: CardSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const allCards = useMemo(() => getCardNames(), []);

  const filteredCards = useMemo(() => {
    let cards = allCards;

    // Apply filter
    switch (filter) {
      case "major":
        cards = cards.filter((card) => MAJOR_ARCANA.includes(card));
        break;
      case "copas":
        cards = cards.filter((card) => COPAS.includes(card));
        break;
      case "ouros":
        cards = cards.filter((card) => OUROS.includes(card));
        break;
      case "paus":
        cards = cards.filter((card) => PAUS.includes(card));
        break;
      case "espadas":
        cards = cards.filter((card) => ESPADAS.includes(card));
        break;
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter((card) => card.toLowerCase().includes(query));
    }

    return cards;
  }, [allCards, searchQuery, filter]);

  const isSelected = (card: string) => selectedCards.includes(card);
  const canSelect = selectedCards.length < maxCards;

  const getCardColor = (card: string): string => {
    if (MAJOR_ARCANA.includes(card)) return "#a78bfa";
    const suit = getCardSuit(card);
    if (suit) return SUIT_INFO[suit].color;
    return "#a1a1aa";
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "#a1a1aa" }}
        />
        <input
          type="text"
          placeholder="Buscar carta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none"
          style={{
            backgroundColor: "#1e1e2e",
            borderColor: "#27273a",
            color: "#fafafa",
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-lg border text-sm transition-colors"
            style={
              filter === f.id
                ? {
                    backgroundColor: f.color || "#a78bfa",
                    color: f.id === "espadas" ? "#0a0a0f" : "#0a0a0f",
                    borderColor: f.color || "#a78bfa",
                  }
                : {
                    backgroundColor: "#1e1e2e",
                    borderColor: "#27273a",
                    color: "#fafafa",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex justify-between text-sm" style={{ color: "#a1a1aa" }}>
        <span>
          {filteredCards.length} cartas
          {filter !== "all" && ` em ${FILTERS.find((f) => f.id === filter)?.label}`}
        </span>
        {selectedCards.length > 0 && (
          <span>
            Selecionadas: {selectedCards.length}/{maxCards}
          </span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredCards.map((card, index) => {
          const selected = isSelected(card);
          const disabled = !selected && !canSelect;
          const number = CARD_NUMBERS[card];
          const cardColor = getCardColor(card);

          return (
            <button
              key={card}
              onClick={() => onSelectCard(card)}
              disabled={disabled}
              className={cn(
                "relative group p-4 rounded-xl border-2 transition-all duration-300 text-left",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                backgroundColor: selected ? `${cardColor}20` : "#161622",
                borderColor: selected ? cardColor : "#27273a",
                animationDelay: `${index * 20}ms`,
              }}
            >
              {number && (
                <span
                  className="absolute top-2 right-2 text-xs font-bold"
                  style={{ color: "#a1a1aa" }}
                >
                  {number}
                </span>
              )}
              <div className="flex flex-col gap-2">
                <Sparkles
                  className="h-5 w-5 transition-colors"
                  style={{ color: selected ? cardColor : "#a1a1aa" }}
                />
                <span className="text-sm font-medium leading-tight">{card}</span>
              </div>
              {selected && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cardColor }}
                >
                  <span className="text-xs font-bold" style={{ color: "#0a0a0f" }}>
                    {selectedCards.indexOf(card) + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8" style={{ color: "#a1a1aa" }}>
          Nenhuma carta encontrada para "{searchQuery}"
        </div>
      )}
    </div>
  );
}
