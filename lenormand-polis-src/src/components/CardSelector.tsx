import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCardNames,
  CARD_CATEGORIES,
  lenormandDictionary,
} from "@/data";

type Filter = "all" | "positive" | "negative" | "neutral" | "people";

const FILTERS: { id: Filter; label: string; color: string }[] = [
  { id: "all", label: "Todas", color: "#d4a574" },
  { id: "positive", label: "Positivas", color: "#4ade80" },
  { id: "negative", label: "Desafiadoras", color: "#f87171" },
  { id: "neutral", label: "Neutras", color: "#60a5fa" },
  { id: "people", label: "Pessoas", color: "#c084fc" },
];

interface CardSelectorProps {
  selectedCards: string[];
  onSelectCard: (card: string) => void;
  maxCards?: number;
}

export function CardSelector({
  selectedCards,
  onSelectCard,
  maxCards = 5,
}: CardSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const allCards = useMemo(() => getCardNames(), []);

  const filteredCards = useMemo(() => {
    let cards = allCards;

    // Apply filter
    switch (filter) {
      case "positive":
        cards = cards.filter((card) => CARD_CATEGORIES["Cartas Positivas"]?.includes(card));
        break;
      case "negative":
        cards = cards.filter((card) => CARD_CATEGORIES["Cartas Negativas"]?.includes(card));
        break;
      case "neutral":
        cards = cards.filter((card) => CARD_CATEGORIES["Cartas Neutras"]?.includes(card));
        break;
      case "people":
        cards = cards.filter((card) => CARD_CATEGORIES["Pessoas"]?.includes(card));
        break;
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter((card) => {
        const cardData = lenormandDictionary[card];
        return (
          card.toLowerCase().includes(query) ||
          cardData?.nome_en.toLowerCase().includes(query) ||
          cardData?.palavras_chave.some((kw) => kw.toLowerCase().includes(query))
        );
      });
    }

    return cards;
  }, [allCards, searchQuery, filter]);

  const isSelected = (card: string) => selectedCards.includes(card);
  const canSelect = selectedCards.length < maxCards;

  const getCardColor = (card: string): string => {
    if (CARD_CATEGORIES["Cartas Positivas"]?.includes(card)) return "#4ade80";
    if (CARD_CATEGORIES["Cartas Negativas"]?.includes(card)) return "#f87171";
    if (CARD_CATEGORIES["Pessoas"]?.includes(card)) return "#c084fc";
    return "#60a5fa";
  };

  const getCardSymbol = (card: string): string => {
    const cardData = lenormandDictionary[card];
    return cardData?.simbolo || "🃏";
  };

  const getCardNumber = (card: string): number => {
    const cardData = lenormandDictionary[card];
    return cardData?.numero || 0;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "#9ca3af" }}
        />
        <input
          type="text"
          placeholder="Buscar carta ou palavra-chave..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none"
          style={{
            backgroundColor: "#1a1a24",
            borderColor: "#2d2d3a",
            color: "#f5f5f5",
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
                    backgroundColor: f.color,
                    color: "#0f0f14",
                    borderColor: f.color,
                  }
                : {
                    backgroundColor: "#1a1a24",
                    borderColor: "#2d2d3a",
                    color: "#f5f5f5",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex justify-between text-sm" style={{ color: "#9ca3af" }}>
        <span>
          {filteredCards.length} cartas
          {filter !== "all" && ` (${FILTERS.find((f) => f.id === filter)?.label})`}
        </span>
        {selectedCards.length > 0 && (
          <span>
            Selecionadas: {selectedCards.length}/{maxCards}
          </span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredCards.map((card, index) => {
          const selected = isSelected(card);
          const disabled = !selected && !canSelect;
          const cardColor = getCardColor(card);
          const symbol = getCardSymbol(card);
          const number = getCardNumber(card);

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
                backgroundColor: selected ? `${cardColor}20` : "#1a1a24",
                borderColor: selected ? cardColor : "#2d2d3a",
                animationDelay: `${index * 20}ms`,
              }}
            >
              <span
                className="absolute top-2 right-2 text-xs font-bold"
                style={{ color: "#9ca3af" }}
              >
                {number}
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-2xl">{symbol}</span>
                <span className="text-sm font-medium leading-tight">{card}</span>
              </div>
              {selected && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cardColor }}
                >
                  <span className="text-xs font-bold" style={{ color: "#0f0f14" }}>
                    {selectedCards.indexOf(card) + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8" style={{ color: "#9ca3af" }}>
          Nenhuma carta encontrada para "{searchQuery}"
        </div>
      )}
    </div>
  );
}
