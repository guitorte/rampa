import { useState, useMemo } from "react";
import { Book, User, X, ChevronDown, ChevronUp, Heart, Briefcase, Activity, Coins } from "lucide-react";
import { getCard, AUTHORS, CARD_CATEGORIES } from "@/data";
import type { Context } from "@/data";

interface CardInterpretationProps {
  cardName: string;
  onRemove: () => void;
  index: number;
}

const CONTEXTS: { id: Context; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "amor", label: "Amor", icon: <Heart className="h-4 w-4" />, color: "#f87171" },
  { id: "trabalho", label: "Trabalho", icon: <Briefcase className="h-4 w-4" />, color: "#60a5fa" },
  { id: "saude", label: "Saude", icon: <Activity className="h-4 w-4" />, color: "#4ade80" },
  { id: "dinheiro", label: "Dinheiro", icon: <Coins className="h-4 w-4" />, color: "#fbbf24" },
];

export function CardInterpretation({
  cardName,
  onRemove,
  index,
}: CardInterpretationProps) {
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(
    new Set(AUTHORS.slice(0, 2).map((a) => a.id))
  );
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);

  const cardData = useMemo(() => getCard(cardName), [cardName]);

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

  if (!cardData) {
    return (
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: "#1a1a24", borderColor: "#2d2d3a" }}
      >
        <p style={{ color: "#9ca3af" }}>
          Interpretacoes nao encontradas para esta carta.
        </p>
      </div>
    );
  }

  const getCardCategoryColor = (): string => {
    if (CARD_CATEGORIES["Cartas Positivas"]?.includes(cardName)) return "#4ade80";
    if (CARD_CATEGORIES["Cartas Negativas"]?.includes(cardName)) return "#f87171";
    if (CARD_CATEGORIES["Pessoas"]?.includes(cardName)) return "#c084fc";
    return "#60a5fa";
  };

  const categoryColor = getCardCategoryColor();

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "#1a1a24",
        borderColor: "#2d2d3a",
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Card Header */}
      <div
        className="relative p-6"
        style={{
          background: `linear-gradient(to right, ${categoryColor}20, ${categoryColor}10, transparent)`,
        }}
      >
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{ backgroundColor: "rgba(15, 15, 20, 0.5)" }}
          aria-label="Remover carta"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-16 h-24 rounded-lg flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: `linear-gradient(to bottom, ${categoryColor}40, ${categoryColor}20)`,
              border: `1px solid ${categoryColor}40`
            }}
          >
            {cardData.simbolo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${categoryColor}30`, color: categoryColor }}
              >
                {cardData.numero}
              </span>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                {cardData.nome_en}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-1">{cardName}</h2>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1 mt-2">
              {cardData.palavras_chave.slice(0, 5).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#2d2d3a", color: "#9ca3af" }}
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* Grammatical roles */}
            <div className="mt-3 text-sm space-y-1" style={{ color: "#9ca3af" }}>
              <div><strong style={{ color: "#d4a574" }}>Como sujeito:</strong> {cardData.como_sujeito}</div>
              <div><strong style={{ color: "#d4a574" }}>Como verbo:</strong> {cardData.como_verbo}</div>
              <div><strong style={{ color: "#d4a574" }}>Como adjetivo:</strong> {cardData.como_adjetivo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Selector */}
      <div
        className="px-6 py-3 border-b flex flex-wrap gap-2"
        style={{ borderColor: "#2d2d3a" }}
      >
        <span className="text-sm mr-2" style={{ color: "#9ca3af" }}>Contexto:</span>
        {CONTEXTS.map((ctx) => (
          <button
            key={ctx.id}
            onClick={() => setSelectedContext(selectedContext === ctx.id ? null : ctx.id)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
            style={
              selectedContext === ctx.id
                ? { backgroundColor: ctx.color, color: "#0f0f14" }
                : { backgroundColor: "#2d2d3a", color: "#9ca3af" }
            }
          >
            {ctx.icon}
            {ctx.label}
          </button>
        ))}
      </div>

      {/* Context-specific interpretation */}
      {selectedContext && cardData.contextos[selectedContext] && (
        <div className="px-6 py-4 border-b" style={{ borderColor: "#2d2d3a", backgroundColor: "#252532" }}>
          <div className="flex gap-3">
            {CONTEXTS.find(c => c.id === selectedContext)?.icon}
            <p className="leading-relaxed" style={{ color: "#f5f5f5" }}>
              {cardData.contextos[selectedContext]}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className="px-6 py-3 border-b flex gap-4"
        style={{ borderColor: "#2d2d3a" }}
      >
        <button
          onClick={expandAll}
          className="text-sm hover:underline"
          style={{ color: "#d4a574" }}
        >
          Expandir todas
        </button>
        <button
          onClick={collapseAll}
          className="text-sm hover:opacity-80"
          style={{ color: "#9ca3af" }}
        >
          Recolher todas
        </button>
      </div>

      {/* Interpretations by Author/Tradition */}
      <div>
        {AUTHORS.map((author, idx) => {
          const interpretation = cardData.significados[author.id];
          if (!interpretation) return null;

          const isExpanded = expandedAuthors.has(author.id);

          return (
            <div
              key={author.id}
              style={{
                borderTop: idx > 0 ? "1px solid #2d2d3a" : undefined,
              }}
            >
              <button
                onClick={() => toggleAuthor(author.id)}
                className="w-full px-6 py-4 flex items-center gap-4 transition-colors text-left hover:opacity-90"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(212, 165, 116, 0.3), rgba(124, 111, 91, 0.3))",
                  }}
                >
                  <User className="h-5 w-5" style={{ color: "#d4a574" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{author.name}</h3>
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    {author.tradition} - {author.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" style={{ color: "#9ca3af" }} />
                ) : (
                  <ChevronDown className="h-5 w-5" style={{ color: "#9ca3af" }} />
                )}
              </button>

              {isExpanded && interpretation && (
                <div className="px-6 pb-6 pl-20">
                  <div className="flex gap-3">
                    <Book
                      className="h-5 w-5 flex-shrink-0 mt-0.5"
                      style={{ color: "#d4a574" }}
                    />
                    <p className="leading-relaxed" style={{ color: "rgba(245, 245, 245, 0.9)" }}>
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
