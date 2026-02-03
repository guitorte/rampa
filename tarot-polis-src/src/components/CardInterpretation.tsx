import { useState, useMemo } from "react";
import { Book, User, X, ChevronDown, ChevronUp } from "lucide-react";
import { getCardInterpretation, AUTHORS, CARD_NUMBERS } from "@/data";
import type { CardInterpretations } from "@/data";

interface CardInterpretationProps {
  cardName: string;
  onRemove: () => void;
  index: number;
}

export function CardInterpretation({
  cardName,
  onRemove,
  index,
}: CardInterpretationProps) {
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(
    new Set(AUTHORS.slice(0, 3).map((a) => a.id))
  );

  const interpretations = useMemo(
    () => getCardInterpretation(cardName),
    [cardName]
  );

  const number = CARD_NUMBERS[cardName];

  const toggleAuthor = (authorId: string) => {
    setExpandedAuthors((prev) => {
      const next = new Set(prev);
      if (next.has(authorId)) {
        next.delete(authorId);
      } else {
        next.add(authorId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedAuthors(new Set(AUTHORS.map((a) => a.id)));
  };

  const collapseAll = () => {
    setExpandedAuthors(new Set());
  };

  if (!interpretations) {
    return (
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: "#161622", borderColor: "#27273a" }}
      >
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
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "#161622",
        borderColor: "#27273a",
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Card Header */}
      <div
        className="relative p-6"
        style={{
          background: "linear-gradient(to right, rgba(167, 139, 250, 0.2), rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
        }}
      >
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{ backgroundColor: "rgba(10, 10, 15, 0.5)" }}
          aria-label="Remover carta"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-16 h-24 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg"
            style={{ background: "linear-gradient(to bottom, #a78bfa, #8b5cf6)" }}
          >
            {number || "?"}
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>
              Carta {index + 1}
            </span>
            <h2 className="text-2xl font-bold mt-1">{cardName}</h2>
            <p className="text-sm mt-2" style={{ color: "#a1a1aa" }}>
              {availableAuthors.length} interpretações disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="px-6 py-3 border-b flex gap-4"
        style={{ borderColor: "#27273a" }}
      >
        <button
          onClick={expandAll}
          className="text-sm hover:underline"
          style={{ color: "#a78bfa" }}
        >
          Expandir todas
        </button>
        <button
          onClick={collapseAll}
          className="text-sm hover:opacity-80"
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
                onClick={() => toggleAuthor(author.id)}
                className="w-full px-6 py-4 flex items-center gap-4 transition-colors text-left hover:opacity-90"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(167, 139, 250, 0.3), rgba(99, 102, 241, 0.3))",
                  }}
                >
                  <User className="h-5 w-5" style={{ color: "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{author.name}</h3>
                  <p className="text-sm" style={{ color: "#a1a1aa" }}>
                    {author.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" style={{ color: "#a1a1aa" }} />
                ) : (
                  <ChevronDown className="h-5 w-5" style={{ color: "#a1a1aa" }} />
                )}
              </button>

              {isExpanded && interpretation && (
                <div className="px-6 pb-6 pl-20">
                  <div className="flex gap-3">
                    <Book
                      className="h-5 w-5 flex-shrink-0 mt-0.5"
                      style={{ color: "#a78bfa" }}
                    />
                    <p className="leading-relaxed" style={{ color: "rgba(250, 250, 250, 0.9)" }}>
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
