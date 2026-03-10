import type { Combination } from "@/App";

interface DesktopSidebarProps {
  cards: (string | null)[];
  combinations: Combination[];
  activeIndex: number;
  onSelectCombination: (index: number) => void;
  onSlotClick: (slot: number) => void;
  onRemoveCard: (slot: number) => void;
}

function shortName(card: string): string {
  if (card.includes(" de ")) {
    const parts = card.split(" de ");
    return `${parts[0]} ${parts[1][0]}`;
  }
  return card.length > 14 ? card.slice(0, 12) + "…" : card;
}

export function DesktopSidebar({
  cards,
  combinations,
  activeIndex,
  onSelectCombination,
  onSlotClick,
  onRemoveCard,
}: DesktopSidebarProps) {
  // Group combinations in pairs (forward/reverse)
  const pairs: [Combination, Combination][] = [];
  for (let i = 0; i < combinations.length; i += 2) {
    if (combinations[i + 1]) {
      pairs.push([combinations[i], combinations[i + 1]]);
    }
  }

  return (
    <aside className="desktop-sidebar">
      {/* Card slots - vertical */}
      <div className="px-5 py-4">
        <p className="label mb-3">Cartas selecionadas</p>
        <div className="space-y-2">
          {cards.map((card, i) => (
            <div key={i} className="flex items-center gap-2">
              {card ? (
                <button
                  onClick={() => onSlotClick(i)}
                  className="flex-1 text-left heading-display text-sm font-semibold truncate py-1"
                >
                  {card}
                </button>
              ) : (
                <button
                  onClick={() => onSlotClick(i)}
                  className="flex-1 text-left text-sm py-1"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  + Carta {i + 1}
                </button>
              )}
              {card && (
                <button
                  onClick={() => onRemoveCard(i)}
                  className="text-xs flex-shrink-0"
                  style={{ color: "var(--color-muted-foreground)" }}
                  aria-label="Remover carta"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Combination list - vertical */}
      {combinations.length > 0 && (
        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--color-border)" }}>
          <p className="label mb-3">Leituras</p>
          <nav className="space-y-1">
            {pairs.map(([a, b], pairIdx) => (
              <div key={pairIdx} className="mb-3">
                <p
                  className="text-xs mb-1.5 font-medium"
                  style={{ color: "var(--color-muted-foreground)", fontSize: "0.7rem" }}
                >
                  {shortName(a.card1)} & {shortName(a.card2)}
                </p>
                {[a, b].map((combo) => {
                  const comboIdx = combinations.indexOf(combo);
                  const isActive = comboIdx === activeIndex;
                  return (
                    <button
                      key={combo.id}
                      onClick={() => onSelectCombination(comboIdx)}
                      className="w-full text-left pl-3 py-1.5 text-sm heading-display font-semibold block transition-colors"
                      style={{
                        color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                        borderLeft: isActive
                          ? "2px solid var(--color-foreground)"
                          : "2px solid transparent",
                      }}
                    >
                      {shortName(combo.card1)}
                      <span style={{ opacity: 0.6, margin: "0 0.25em" }}>→</span>
                      {shortName(combo.card2)}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
