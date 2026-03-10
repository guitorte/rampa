import { useState, useCallback, useMemo, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { getInteraction } from "@/data";

import { BottomSheet } from "@/components/BottomSheet";
import { CardBrowser } from "@/components/CardBrowser";
import { CardSlots } from "@/components/CardSlots";
import { CombinationTabs } from "@/components/CombinationTabs";
import { ReadingContent } from "@/components/ReadingContent";
import { EmptyState } from "@/components/EmptyState";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MAX_CARDS = 3;

export interface Combination {
  id: string;
  card1: string;
  card2: string;
}

// Directional: A→B and B→A are distinct readings
// Paired order: [A→B, B→A, A→C, C→A, B→C, C→B]
function generateCombinations(cards: string[]): Combination[] {
  const combos: Combination[] = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      combos.push({
        id: `${i}-${j}`,
        card1: cards[i],
        card2: cards[j],
      });
      combos.push({
        id: `${j}-${i}`,
        card1: cards[j],
        card2: cards[i],
      });
    }
  }
  return combos;
}

type AppView = "empty" | "selecting" | "reading";

function App() {
  const [cards, setCards] = useState<(string | null)[]>([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [activeCombination, setActiveCombination] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filledCards = cards.filter(Boolean) as string[];
  const filledCount = filledCards.length;

  const view: AppView = useMemo(() => {
    if (filledCount === 0) return "empty";
    if (filledCount >= 2) return "reading";
    return "selecting";
  }, [filledCount]);

  const combinations = useMemo(() => generateCombinations(filledCards), [filledCards]);

  useEffect(() => {
    if (activeCombination >= combinations.length && combinations.length > 0) {
      setActiveCombination(0);
    }
  }, [activeCombination, combinations.length]);

  const activePair = combinations[activeCombination] || null;

  const interaction = useMemo(() => {
    if (!activePair) return null;
    return getInteraction(activePair.card1, activePair.card2);
  }, [activePair]);

  const navigateCombination = useCallback(
    (direction: -1 | 1) => {
      setActiveCombination((prev) => {
        const next = prev + direction;
        if (next >= 0 && next < combinations.length) return next;
        return prev;
      });
    },
    [combinations.length],
  );

  const swipe = useSwipeNavigation({
    onSwipeLeft: () => navigateCombination(1),
    onSwipeRight: () => navigateCombination(-1),
  });

  useEffect(() => {
    if (view !== "reading") return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") navigateCombination(-1);
      else if (e.key === "ArrowRight") navigateCombination(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, navigateCombination]);

  const handleSlotClick = useCallback((slot: number) => {
    setActiveSlot(slot);
    setIsSheetOpen(true);
  }, []);

  const handleSelectCard = useCallback(
    (cardName: string) => {
      setCards((prev) => {
        const next = [...prev];
        const existingIdx = next.indexOf(cardName);
        if (existingIdx !== -1 && existingIdx !== activeSlot) {
          next[existingIdx] = next[activeSlot];
        }
        next[activeSlot] = cardName;
        return next;
      });

      const nextEmpty = cards.findIndex((c, i) => i !== activeSlot && c === null);
      if (nextEmpty !== -1) {
        setActiveSlot(nextEmpty);
        return;
      }

      setIsSheetOpen(false);
      setActiveCombination(0);
    },
    [activeSlot, cards],
  );

  const handleRemoveCard = useCallback((slot: number) => {
    setCards((prev) => {
      const next = [...prev];
      next[slot] = null;
      return next;
    });
    setActiveCombination(0);
  }, []);

  const handleReset = useCallback(() => {
    setCards([null, null, null]);
    setActiveSlot(0);
    setActiveCombination(0);
    setIsSheetOpen(false);
  }, []);

  const handleStart = useCallback(() => {
    setActiveSlot(0);
    setIsSheetOpen(true);
  }, []);

  // Desktop layout
  if (isDesktop) {
    return (
      <div className="app-shell md:flex-row">
        {/* Header - full width on desktop */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-5 w-full md:absolute md:top-0 md:left-0 md:right-0 md:z-20"
          style={{ height: "48px", borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-background)" }}
        >
          <h1
            className="heading-display font-semibold"
            style={{ fontSize: "1.1rem", letterSpacing: "0.02em" }}
          >
            Tarô Quebrado
          </h1>

          {view !== "empty" && (
            <button
              onClick={handleReset}
              className="touch-target flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <RotateCcw className="h-3 w-3" />
              Nova leitura
            </button>
          )}
        </header>

        <div className="flex flex-1 min-h-0" style={{ paddingTop: "48px" }}>
          {/* Sidebar */}
          {view !== "empty" && (
            <DesktopSidebar
              cards={cards}
              combinations={combinations}
              activeIndex={activeCombination}
              onSelectCombination={setActiveCombination}
              onSlotClick={handleSlotClick}
              onRemoveCard={handleRemoveCard}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-h-0 flex flex-col" style={{ borderLeft: view !== "empty" ? "1px solid var(--color-border)" : undefined }}>
            {view === "empty" ? (
              <EmptyState onStart={handleStart} />
            ) : view === "reading" && combinations.length > 0 ? (
              <div className="flex-1 min-h-0 flex flex-col desktop-reading">
                <ReadingContent
                  combination={activePair!}
                  interaction={interaction}
                  combinationIndex={activeCombination}
                  totalCombinations={combinations.length}
                  onNavigate={navigateCombination}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-sm mb-5" style={{ color: "var(--color-muted-foreground)" }}>
                  Selecione mais uma carta para iniciar a leitura.
                </p>
                <button
                  onClick={() => {
                    const nextEmpty = cards.findIndex((c) => c === null);
                    if (nextEmpty !== -1) handleSlotClick(nextEmpty);
                  }}
                  className="touch-target flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  Escolher carta
                  <span>→</span>
                </button>
              </div>
            )}
          </main>
        </div>

        <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
          <CardBrowser
            selectedCards={filledCards}
            onSelectCard={handleSelectCard}
            maxCards={MAX_CARDS}
            activeSlot={activeSlot}
          />
        </BottomSheet>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="app-shell">
      {/* Skip link for keyboard users */}
      <a
        href="#reading-content"
        className="skip-link"
      >
        Pular para leitura
      </a>

      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5"
        style={{ height: "44px", borderBottom: "1px solid var(--color-border)" }}
      >
        <h1
          className="heading-display font-semibold"
          style={{ fontSize: "1.1rem", letterSpacing: "0.02em" }}
        >
          Tarô Quebrado
        </h1>

        {view !== "empty" && (
          <button
            onClick={handleReset}
            className="touch-target flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            <RotateCcw className="h-3 w-3" />
            Nova leitura
          </button>
        )}
      </header>

      {view === "empty" ? (
        <EmptyState onStart={handleStart} />
      ) : (
        <>
          <div className="flex-shrink-0">
            <CardSlots
              cards={cards}
              onSlotClick={handleSlotClick}
              onRemoveCard={handleRemoveCard}
            />
          </div>

          {view === "reading" && combinations.length > 0 ? (
            <>
              {combinations.length > 1 && (
                <div className="flex-shrink-0">
                  <CombinationTabs
                    combinations={combinations}
                    activeIndex={activeCombination}
                    onSelect={setActiveCombination}
                  />
                </div>
              )}

              <div id="reading-content" className="flex-1 min-h-0 flex flex-col" {...swipe.handlers}>
                <ReadingContent
                  combination={activePair!}
                  interaction={interaction}
                  combinationIndex={activeCombination}
                  totalCombinations={combinations.length}
                  onNavigate={navigateCombination}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-sm mb-5" style={{ color: "var(--color-muted-foreground)" }}>
                Selecione mais uma carta para iniciar a leitura.
              </p>
              <button
                onClick={() => {
                  const nextEmpty = cards.findIndex((c) => c === null);
                  if (nextEmpty !== -1) handleSlotClick(nextEmpty);
                }}
                className="touch-target flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                Escolher carta
                <span>→</span>
              </button>
            </div>
          )}
        </>
      )}

      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <CardBrowser
          selectedCards={filledCards}
          onSelectCard={handleSelectCard}
          maxCards={MAX_CARDS}
          activeSlot={activeSlot}
        />
      </BottomSheet>
    </div>
  );
}

export default App;
