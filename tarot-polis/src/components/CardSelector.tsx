import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCardNames, MAJOR_ARCANA, CARD_NUMBERS } from "@/data";

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
  const [showMajorOnly, setShowMajorOnly] = useState(true);

  const allCards = useMemo(() => getCardNames(), []);

  const filteredCards = useMemo(() => {
    let cards = showMajorOnly
      ? allCards.filter((card) => MAJOR_ARCANA.includes(card))
      : allCards;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter((card) => card.toLowerCase().includes(query));
    }

    return cards;
  }, [allCards, searchQuery, showMajorOnly]);

  const isSelected = (card: string) => selectedCards.includes(card);
  const canSelect = selectedCards.length < maxCards;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
        <button
          onClick={() => setShowMajorOnly(!showMajorOnly)}
          className="px-4 py-2 rounded-lg border transition-colors whitespace-nowrap"
          style={
            showMajorOnly
              ? { backgroundColor: "#a78bfa", color: "#0a0a0f", borderColor: "#a78bfa" }
              : { backgroundColor: "#1e1e2e", borderColor: "#27273a", color: "#fafafa" }
          }
        >
          {showMajorOnly ? "Arcanos Maiores" : "Todas as Cartas"}
        </button>
      </div>

      <div className="text-sm" style={{ color: "#a1a1aa" }}>
        {selectedCards.length > 0 ? (
          <span>
            Selecionadas: {selectedCards.length}/{maxCards}
          </span>
        ) : (
          <span>Selecione até {maxCards} cartas para sua leitura</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredCards.map((card, index) => {
          const selected = isSelected(card);
          const disabled = !selected && !canSelect;
          const number = CARD_NUMBERS[card];

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
                backgroundColor: selected ? "rgba(167, 139, 250, 0.2)" : "#161622",
                borderColor: selected ? "#a78bfa" : "#27273a",
                animationDelay: `${index * 30}ms`,
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
                  style={{ color: selected ? "#a78bfa" : "#a1a1aa" }}
                />
                <span className="text-sm font-medium leading-tight">{card}</span>
              </div>
              {selected && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#a78bfa" }}
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
