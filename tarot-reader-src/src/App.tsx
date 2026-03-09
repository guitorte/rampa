import { useState, useCallback, useMemo, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { getInteraction, DYNAMICS_ORDER } from "@/data";
import type { DynamicKey } from "@/data";

import { BottomSheet } from "@/components/BottomSheet";
import { CardBrowser } from "@/components/CardBrowser";
import { CardSlots } from "@/components/CardSlots";
import { DynamicTabs } from "@/components/DynamicTabs";
import { ReadingContent } from "@/components/ReadingContent";
import { EmptyState } from "@/components/EmptyState";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const MAX_CARDS = 2;

type AppView = "empty" | "selecting" | "reading";

function App() {
  const [card1, setCard1] = useState<string | null>(null);
  const [card2, setCard2] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [activeDynamic, setActiveDynamic] = useState<DynamicKey>("engendrar");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Determine current view
  const view: AppView = useMemo(() => {
    if (!card1 && !card2) return "empty";
    if (card1 && card2) return "reading";
    return "selecting";
  }, [card1, card2]);

  // Get interaction data when both cards selected
  const interaction = useMemo(() => {
    if (!card1 || !card2) return null;
    return getInteraction(card1, card2);
  }, [card1, card2]);

  const currentContent = interaction ? interaction[activeDynamic] : null;

  // Navigate dynamics
  const navigateDynamic = useCallback(
    (direction: -1 | 1) => {
      const idx = DYNAMICS_ORDER.indexOf(activeDynamic);
      const next = idx + direction;
      if (next >= 0 && next < DYNAMICS_ORDER.length) {
        setActiveDynamic(DYNAMICS_ORDER[next]);
      }
    },
    [activeDynamic],
  );

  // Swipe navigation for dynamics
  const swipe = useSwipeNavigation({
    onSwipeLeft: () => navigateDynamic(1),
    onSwipeRight: () => navigateDynamic(-1),
  });

  // Keyboard navigation
  useEffect(() => {
    if (view !== "reading") return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") navigateDynamic(-1);
      else if (e.key === "ArrowRight") navigateDynamic(1);
      else if (e.key >= "1" && e.key <= "5") {
        const idx = parseInt(e.key) - 1;
        if (idx < DYNAMICS_ORDER.length) setActiveDynamic(DYNAMICS_ORDER[idx]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, navigateDynamic]);

  // Open sheet for a specific slot
  const handleSlotClick = useCallback((slot: 0 | 1) => {
    setActiveSlot(slot);
    setIsSheetOpen(true);
  }, []);

  // Handle card selection from browser
  const handleSelectCard = useCallback(
    (cardName: string) => {
      if (activeSlot === 0) {
        // If selecting same card that's in slot 2, swap
        if (card2 === cardName) {
          setCard2(card1);
        }
        setCard1(cardName);
        // Auto-advance to next empty slot
        if (!card2) {
          setActiveSlot(1);
          // Keep sheet open for slot 2
          return;
        }
      } else {
        // If selecting same card that's in slot 1, swap
        if (card1 === cardName) {
          setCard1(card2);
        }
        setCard2(cardName);
      }
      setIsSheetOpen(false);
      setActiveDynamic("engendrar");
    },
    [activeSlot, card1, card2],
  );

  // Remove card from a slot
  const handleRemoveCard = useCallback(
    (slot: 0 | 1) => {
      if (slot === 0) {
        setCard1(null);
      } else {
        setCard2(null);
      }
      setActiveDynamic("engendrar");
    },
    [],
  );

  // Reset everything
  const handleReset = useCallback(() => {
    setCard1(null);
    setCard2(null);
    setActiveSlot(0);
    setActiveDynamic("engendrar");
    setIsSheetOpen(false);
  }, []);

  // Start from empty state
  const handleStart = useCallback(() => {
    setActiveSlot(0);
    setIsSheetOpen(true);
  }, []);

  const selectedCards = [card1, card2].filter(Boolean) as string[];

  return (
    <div className="app-shell" style={{ backgroundColor: "#0f0a1a", color: "#f5f3f7" }}>
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 safe-top"
        style={{
          height: "48px",
          borderBottom: "1px solid #2a1f3d",
        }}
      >
        <h1
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="gradient-text">Oraculo</span>
        </h1>

        <div className="flex items-center gap-3">
          {view !== "empty" && (
            <button
              onClick={handleReset}
              className="touch-target flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: "#1e1530",
                color: "#a8a0b5",
                border: "1px solid #2a1f3d",
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Nova Leitura
            </button>
          )}
        </div>
      </header>

      {view === "empty" ? (
        <EmptyState onStart={handleStart} />
      ) : (
        <>
          {/* Card Slots - always visible when selecting or reading */}
          <div className="flex-shrink-0">
            <CardSlots
              card1={card1}
              card2={card2}
              onSlotClick={handleSlotClick}
              onRemoveCard={handleRemoveCard}
              isReading={view === "reading"}
            />
          </div>

          {view === "reading" && card1 && card2 ? (
            <>
              {/* Dynamic tabs */}
              <div className="flex-shrink-0">
                <DynamicTabs
                  activeDynamic={activeDynamic}
                  onDynamicChange={setActiveDynamic}
                />
              </div>

              {/* Reading content */}
              <div className="flex-1 min-h-0 flex flex-col" {...swipe.handlers}>
                <ReadingContent
                  card1={card1}
                  card2={card2}
                  activeDynamic={activeDynamic}
                  content={currentContent}
                  onNavigate={navigateDynamic}
                />
              </div>
            </>
          ) : (
            /* Selecting state - prompt */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="ambient-bg" />
              <p className="text-sm mb-4" style={{ color: "#a8a0b5" }}>
                {card1
                  ? "Selecione a segunda carta para revelar a leitura."
                  : "Toque em um dos espaços acima para escolher uma carta."}
              </p>
              {!card1 && (
                <button
                  onClick={() => handleSlotClick(0)}
                  className="touch-target px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: "#a855f7",
                    color: "#0f0a1a",
                  }}
                >
                  Escolher Carta 1
                </button>
              )}
              {card1 && !card2 && (
                <button
                  onClick={() => handleSlotClick(1)}
                  className="touch-target px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: "#a855f7",
                    color: "#0f0a1a",
                  }}
                >
                  Escolher Carta 2
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Bottom sheet */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <CardBrowser
          selectedCards={selectedCards}
          onSelectCard={handleSelectCard}
          maxCards={MAX_CARDS}
          activeSlot={activeSlot}
        />
      </BottomSheet>
    </div>
  );
}

export default App;
