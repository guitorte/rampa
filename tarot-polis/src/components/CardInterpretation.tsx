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
      <div className="p-6 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">
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
      className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-mystic/20 p-6">
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
          aria-label="Remover carta"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-24 bg-gradient-to-b from-primary to-mystic rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {number || "?"}
          </div>
          <div>
            <span className="text-sm text-primary font-medium">
              Carta {index + 1}
            </span>
            <h2 className="text-2xl font-bold mt-1">{cardName}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {availableAuthors.length} interpretações disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-3 border-b border-border flex gap-4">
        <button
          onClick={expandAll}
          className="text-sm text-primary hover:underline"
        >
          Expandir todas
        </button>
        <button
          onClick={collapseAll}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Recolher todas
        </button>
      </div>

      {/* Interpretations */}
      <div className="divide-y divide-border">
        {availableAuthors.map((author) => {
          const interpretation =
            interpretations[author.id as keyof CardInterpretations];
          const isExpanded = expandedAuthors.has(author.id);

          return (
            <div key={author.id} className="group">
              <button
                onClick={() => toggleAuthor(author.id)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{author.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {author.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && interpretation && (
                <div className="px-6 pb-6 pl-20 animate-fade-in">
                  <div className="flex gap-3">
                    <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground/90 leading-relaxed">
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
