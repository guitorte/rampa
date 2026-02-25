import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { AUTHORS } from "@/data";

import { BottomSheet } from "@/components/BottomSheet";
import { CardBrowser } from "@/components/CardBrowser";
import { CardTabs } from "@/components/CardTabs";
import { CardInterpretation } from "@/components/CardInterpretation";
import { EmptyState } from "@/components/EmptyState";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const MAX_CARDS = 3;
const DEFAULT_EXPANDED = new Set(AUTHORS.slice(0, 3).map((a) => a.id));

function App() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [accordionState, setAccordionState] = useState<Map<string, Set<string>>>(new Map());

  const getExpandedAuthors = useCallback(
    (cardName: string): Set<string> => {
      return accordionState.get(cardName) ?? DEFAULT_EXPANDED;
    },
    [accordionState]
  );

  const handleToggleAuthor = useCallback(
    (cardName: string, authorId: string) => {
      setAccordionState((prev) => {
        const next = new Map(prev);
        const current = new Set(next.get(cardName) ?? DEFAULT_EXPANDED);
        if (current.has(authorId)) {
          current.delete(authorId);
        } else {
          current.add(authorId);
        }
        next.set(cardName, current);
        return next;
      });
    },
    []
  );

  const handleExpandAll = useCallback((cardName: string) => {
    setAccordionState((prev) => {
      const next = new Map(prev);
      next.set(cardName, new Set(AUTHORS.map((a) => a.id)));
      return next;
    });
  }, []);

  const handleCollapseAll = useCallback((cardName: string) => {
    setAccordionState((prev) => {
      const next = new Map(prev);
      next.set(cardName, new Set());
      return next;
    });
  }, []);

  const handleSelectCard = useCallback((card: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(card)) return prev;
      if (prev.length >= MAX_CARDS) return prev;
      const next = [...prev, card];
      // Activate the newly added card
      setActiveCardIndex(next.length - 1);
      return next;
    });
    setIsSheetOpen(false);
  }, []);

  const handleRemoveCard = useCallback(
    (card: string) => {
      setSelectedCards((prev) => {
        const next = prev.filter((c) => c !== card);
        // Adjust active index
        const removedIndex = prev.indexOf(card);
        setActiveCardIndex((currentActive) => {
          if (next.length === 0) return 0;
          if (currentActive >= next.length) return next.length - 1;
          if (removedIndex < currentActive) return currentActive - 1;
          return currentActive;
        });
        return next;
      });
      // Clean up accordion state for removed card
      setAccordionState((prev) => {
        const next = new Map(prev);
        next.delete(card);
        return next;
      });
    },
    []
  );

  const activeCard = selectedCards[activeCardIndex];
  const hasCards = selectedCards.length > 0;
  const canAddMore = selectedCards.length < MAX_CARDS;

  const swipe = useSwipeNavigation({
    onSwipeLeft: () => {
      if (activeCardIndex < selectedCards.length - 1) {
        setActiveCardIndex(activeCardIndex + 1);
      }
    },
    onSwipeRight: () => {
      if (activeCardIndex > 0) {
        setActiveCardIndex(activeCardIndex - 1);
      }
    },
  });

  return (
    <div className="app-shell" style={{ backgroundColor: "#0a0a0f", color: "#fafafa" }}>
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 safe-top"
        style={{
          height: "48px",
          borderBottom: "1px solid #27273a",
        }}
      >
        <h1
          className="text-lg font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #a78bfa, #6366f1)" }}
        >
          Tarot-Polis
        </h1>

        <div className="flex items-center gap-3">
          {hasCards && (
            <span className="text-xs font-medium" style={{ color: "#a1a1aa" }}>
              {selectedCards.length}/{MAX_CARDS}
            </span>
          )}
          {canAddMore && (
            <button
              onClick={() => setIsSheetOpen(true)}
              className="touch-target flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ backgroundColor: "#a78bfa", color: "#0a0a0f" }}
              aria-label="Adicionar carta"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Card tabs */}
      <div className="flex-shrink-0">
        <CardTabs
          selectedCards={selectedCards}
          activeCardIndex={activeCardIndex}
          onTabChange={setActiveCardIndex}
          onRemoveCard={handleRemoveCard}
        />
      </div>

      {/* Content area */}
      {hasCards && activeCard ? (
        <div className="flex-1 min-h-0 flex flex-col" {...swipe.handlers}>
          <CardInterpretation
            key={activeCard}
            cardName={activeCard}
            expandedAuthors={getExpandedAuthors(activeCard)}
            onToggleAuthor={(authorId) => handleToggleAuthor(activeCard, authorId)}
            onExpandAll={() => handleExpandAll(activeCard)}
            onCollapseAll={() => handleCollapseAll(activeCard)}
          />
        </div>
      ) : (
        <EmptyState onOpenSheet={() => setIsSheetOpen(true)} />
      )}

      {/* FAB for adding cards when tabs exist but not full */}
      {hasCards && canAddMore && (
        <button
          onClick={() => setIsSheetOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30"
          style={{
            backgroundColor: "#a78bfa",
            color: "#0a0a0f",
            boxShadow: "0 4px 20px rgba(167, 139, 250, 0.3)",
            marginBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          aria-label="Adicionar carta"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Bottom sheet */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <CardBrowser
          selectedCards={selectedCards}
          onSelectCard={handleSelectCard}
          maxCards={MAX_CARDS}
        />
      </BottomSheet>
    </div>
  );
}

export default App;
