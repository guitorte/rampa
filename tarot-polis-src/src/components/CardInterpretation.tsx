import { useMemo } from "react";
import { Book, User, ChevronDown, ChevronUp } from "lucide-react";
import { getCardInterpretation, AUTHORS, CARD_NUMBERS, getCardSuit, SUIT_INFO, isMajorArcana } from "@/data";
import type { CardInterpretations } from "@/data";

interface CardInterpretationProps {
  cardName: string;
  expandedAuthors: Set<string>;
  onToggleAuthor: (authorId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function CardInterpretation({
  cardName,
  expandedAuthors,
  onToggleAuthor,
  onExpandAll,
  onCollapseAll,
}: CardInterpretationProps) {
  const interpretations = useMemo(
    () => getCardInterpretation(cardName),
    [cardName]
  );

  const number = CARD_NUMBERS[cardName];
  const suit = getCardSuit(cardName);
  const isMajor = isMajorArcana(cardName);

  const suitLabel = isMajor
    ? "Arcano Maior"
    : suit
      ? SUIT_INFO[suit].name
      : "";

  const suitColor = isMajor
    ? "#a78bfa"
    : suit
      ? SUIT_INFO[suit].color
      : "#a1a1aa";

  if (!interpretations) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p style={{ color: "#a1a1aa" }}>
          Interpretações não encontradas para esta carta.
        </p>
      </div>
    );
  }

  const availableAuthors = AUTHORS.filter(
    (author) => interpretations[author.id as keyof CardInterpretations]
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Compact card header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #27273a" }}>
        <span
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: `${suitColor}20`,
            color: suitColor,
          }}
        >
          {number || "?"}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold truncate">{cardName}</h2>
          <p className="text-xs" style={{ color: suitColor }}>
            {suitLabel} · {availableAuthors.length} interpretações
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-2 flex gap-4" style={{ borderBottom: "1px solid #27273a" }}>
        <button
          onClick={onExpandAll}
          className="touch-target text-sm py-2"
          style={{ color: "#a78bfa" }}
        >
          Expandir todas
        </button>
        <button
          onClick={onCollapseAll}
          className="touch-target text-sm py-2"
          style={{ color: "#a1a1aa" }}
        >
          Recolher todas
        </button>
      </div>

      {/* Interpretations */}
      <div>
        {availableAuthors.map((author, idx) => {
          const interpretation =
            interpretations[author.id as keyof CardInterpretations];
          const isExpanded = expandedAuthors.has(author.id);

          return (
            <div
              key={author.id}
              style={{
                borderTop: idx > 0 ? "1px solid #27273a" : undefined,
              }}
            >
              <button
                onClick={() => onToggleAuthor(author.id)}
                className="touch-target w-full px-4 py-3 flex items-center gap-3 text-left"
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(167, 139, 250, 0.3), rgba(99, 102, 241, 0.3))",
                  }}
                >
                  <User className="h-4 w-4" style={{ color: "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{author.name}</h3>
                  <p className="text-xs" style={{ color: "#a1a1aa" }}>
                    {author.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "#a1a1aa" }} />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "#a1a1aa" }} />
                )}
              </button>

              {isExpanded && interpretation && (
                <div className="px-4 pb-4 pl-16">
                  <div className="flex gap-2">
                    <Book
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#a78bfa" }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(250, 250, 250, 0.9)" }}>
                      {interpretation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
