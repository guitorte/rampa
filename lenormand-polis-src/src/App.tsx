import { useState, useCallback, useEffect } from "react";
import { ArrowUp, Layers, BookOpen, Combine } from "lucide-react";
import { cn } from "@/lib/utils";

import { Header } from "@/components/Header";
import { CardSelector } from "@/components/CardSelector";
import { CardInterpretation } from "@/components/CardInterpretation";
import { CombinationDisplay } from "@/components/CombinationDisplay";
import { ReadingProgress } from "@/components/ReadingProgress";

function App() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [viewMode, setViewMode] = useState<"individual" | "combination">("combination");

  const handleSelectCard = useCallback((card: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter((c) => c !== card);
      }
      if (prev.length < 5) {
        return [...prev, card];
      }
      return prev;
    });
  }, []);

  const handleRemoveCard = useCallback((card: string) => {
    setSelectedCards((prev) => prev.filter((c) => c !== card));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCards([]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToReadings = () => {
    document.getElementById("readings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0f14", color: "#f5f5f5" }}>
      <ReadingProgress />

      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-24">
        {/* Card Selection Section */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(212, 165, 116, 0.2)" }}>
              <Layers className="h-5 w-5" style={{ color: "#d4a574" }} />
            </div>
            <h2 className="text-2xl font-bold">Selecione suas Cartas</h2>
          </div>

          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={handleSelectCard}
            maxCards={5}
          />

          {selectedCards.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "rgba(26, 26, 36, 0.5)", borderColor: "#2d2d3a" }}>
              <div className="flex flex-wrap gap-2">
                {selectedCards.map((card, index) => (
                  <span
                    key={card}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: "rgba(212, 165, 116, 0.2)", color: "#d4a574" }}
                  >
                    {index + 1}. {card}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm rounded-lg border transition-colors hover:opacity-80"
                  style={{ borderColor: "#2d2d3a" }}
                >
                  Limpar
                </button>
                <button
                  onClick={scrollToReadings}
                  className="px-4 py-2 text-sm rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#d4a574", color: "#0f0f14" }}
                >
                  Ver Leitura
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Readings Section */}
        {selectedCards.length > 0 && (
          <section id="readings" className="py-12">
            {/* View Mode Toggle */}
            {selectedCards.length >= 2 && (
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setViewMode("combination")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    viewMode === "combination" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  )}
                  style={{
                    backgroundColor: viewMode === "combination" ? "#d4a574" : "#252532",
                    color: viewMode === "combination" ? "#0f0f14" : "#f5f5f5",
                  }}
                >
                  <Combine className="h-4 w-4" />
                  Combinacoes
                </button>
                <button
                  onClick={() => setViewMode("individual")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    viewMode === "individual" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  )}
                  style={{
                    backgroundColor: viewMode === "individual" ? "#d4a574" : "#252532",
                    color: viewMode === "individual" ? "#0f0f14" : "#f5f5f5",
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  Individual
                </button>
              </div>
            )}

            {/* Combination View */}
            {(viewMode === "combination" && selectedCards.length >= 2) && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(192, 132, 252, 0.2)" }}>
                    <Combine className="h-5 w-5" style={{ color: "#c084fc" }} />
                  </div>
                  <h2 className="text-2xl font-bold">Leitura Combinada</h2>
                </div>
                <CombinationDisplay selectedCards={selectedCards} />
              </div>
            )}

            {/* Individual Cards View */}
            {(viewMode === "individual" || selectedCards.length === 1) && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(96, 165, 250, 0.2)" }}>
                    <BookOpen className="h-5 w-5" style={{ color: "#60a5fa" }} />
                  </div>
                  <h2 className="text-2xl font-bold">Cartas Individuais</h2>
                </div>

                <div className="space-y-8">
                  {selectedCards.map((card, index) => (
                    <CardInterpretation
                      key={card}
                      cardName={card}
                      index={index}
                      onRemove={() => handleRemoveCard(card)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {selectedCards.length === 0 && (
          <section className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: "#1a1a24" }}>
              <BookOpen className="h-10 w-10" style={{ color: "#9ca3af" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma carta selecionada
            </h3>
            <p className="max-w-md mx-auto" style={{ color: "#9ca3af" }}>
              Selecione ate 5 cartas acima para ver as interpretacoes de 5
              tradicoes diferentes e descobrir como elas se combinam.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid #2d2d3a" }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm" style={{ color: "#9ca3af" }}>
          <p>
            Interpretacoes compiladas de Rana George, Caitlin Matthews,
            Andy Boroveshengra, Tradicao Alema e Tradicao Brasileira.
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300",
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ backgroundColor: "#d4a574", color: "#0f0f14" }}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}

export default App;
