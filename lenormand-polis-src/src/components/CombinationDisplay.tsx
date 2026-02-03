import { useMemo } from "react";
import { Combine, ArrowRight, Sparkles } from "lucide-react";
import { getCard, generateCombinationInterpretation, getCardCombination } from "@/data";

interface CombinationDisplayProps {
  selectedCards: string[];
}

export function CombinationDisplay({ selectedCards }: CombinationDisplayProps) {
  const combinations = useMemo(() => {
    if (selectedCards.length < 2) return [];

    const result: Array<{
      card1: string;
      card2: string;
      interpretation: string;
      isDocumented: boolean;
    }> = [];

    // Generate all pairs
    for (let i = 0; i < selectedCards.length - 1; i++) {
      const card1 = selectedCards[i];
      const card2 = selectedCards[i + 1];

      // Check if there's a documented combination
      const documented = getCardCombination(card1, card2) || getCardCombination(card2, card1);

      result.push({
        card1,
        card2,
        interpretation: documented || generateCombinationInterpretation(card1, card2),
        isDocumented: !!documented,
      });
    }

    return result;
  }, [selectedCards]);

  const sentenceReading = useMemo(() => {
    if (selectedCards.length < 2) return null;

    const parts: string[] = [];

    selectedCards.forEach((cardName, index) => {
      const card = getCard(cardName);
      if (!card) return;

      if (index === 0) {
        // First card as subject
        parts.push(card.como_sujeito);
      } else if (index === selectedCards.length - 1) {
        // Last card as adjective/qualifier
        parts.push(`que ${card.como_verbo.toLowerCase()}`);
      } else {
        // Middle cards as verbs/actions
        parts.push(card.como_verbo.toLowerCase());
      }
    });

    return parts.join(" ");
  }, [selectedCards]);

  if (selectedCards.length < 2) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Sentence Reading */}
      <div
        className="p-6 rounded-2xl border"
        style={{
          backgroundColor: "#1a1a24",
          borderColor: "#2d2d3a",
          background: "linear-gradient(to right, rgba(212, 165, 116, 0.1), rgba(124, 111, 91, 0.05))",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "rgba(212, 165, 116, 0.2)" }}
          >
            <Sparkles className="h-5 w-5" style={{ color: "#d4a574" }} />
          </div>
          <h3 className="text-lg font-semibold">Leitura como Sentenca</h3>
        </div>

        {/* Visual card sequence */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {selectedCards.map((cardName, index) => {
            const card = getCard(cardName);
            return (
              <div key={cardName} className="flex items-center gap-2">
                <div
                  className="px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: "#252532", border: "1px solid #2d2d3a" }}
                >
                  <span className="text-xl">{card?.simbolo}</span>
                  <span className="text-sm font-medium">{cardName}</span>
                </div>
                {index < selectedCards.length - 1 && (
                  <ArrowRight className="h-4 w-4" style={{ color: "#9ca3af" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Sentence interpretation */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: "#252532" }}
        >
          <p className="text-lg leading-relaxed" style={{ color: "#f5f5f5" }}>
            "{sentenceReading}"
          </p>
        </div>
      </div>

      {/* Pair Combinations */}
      <div
        className="p-6 rounded-2xl border"
        style={{ backgroundColor: "#1a1a24", borderColor: "#2d2d3a" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "rgba(192, 132, 252, 0.2)" }}
          >
            <Combine className="h-5 w-5" style={{ color: "#c084fc" }} />
          </div>
          <h3 className="text-lg font-semibold">Combinacoes de Pares</h3>
        </div>

        <div className="space-y-4">
          {combinations.map(({ card1, card2, interpretation, isDocumented }, index) => {
            const c1 = getCard(card1);
            const c2 = getCard(card2);

            return (
              <div
                key={`${card1}-${card2}`}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "#252532",
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c1?.simbolo}</span>
                    <span className="font-medium">{card1}</span>
                  </div>
                  <span style={{ color: "#9ca3af" }}>+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c2?.simbolo}</span>
                    <span className="font-medium">{card2}</span>
                  </div>
                  {isDocumented && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(74, 222, 128, 0.2)", color: "#4ade80" }}
                    >
                      Tradicional
                    </span>
                  )}
                </div>
                <p className="leading-relaxed" style={{ color: "#9ca3af" }}>
                  {interpretation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
