import { useState, useCallback, useEffect } from "react";
import { ArrowUp, Layers, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// Import components and data with error boundaries
import { Header } from "@/components/Header";
import { CardSelector } from "@/components/CardSelector";
import { CardInterpretation } from "@/components/CardInterpretation";
import { ReadingProgress } from "@/components/ReadingProgress";

function App() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleSelectCard = useCallback((card: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter((c) => c !== card);
      }
      if (prev.length < 3) {
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

  // Handle scroll for back to top button
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
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f", color: "#fafafa" }}>
      <ReadingProgress />

      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-24">
        {/* Card Selection Section */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(167, 139, 250, 0.2)" }}>
              <Layers className="h-5 w-5" style={{ color: "#a78bfa" }} />
            </div>
            <h2 className="text-2xl font-bold">Selecione suas Cartas</h2>
          </div>

          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={handleSelectCard}
            maxCards={3}
          />

          {selectedCards.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "rgba(30, 30, 46, 0.5)", borderColor: "#27273a" }}>
              <div className="flex flex-wrap gap-2">
                {selectedCards.map((card, index) => (
                  <span
                    key={card}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: "rgba(167, 139, 250, 0.2)", color: "#a78bfa" }}
                  >
                    {index + 1}. {card}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm rounded-lg border transition-colors hover:opacity-80"
                  style={{ borderColor: "#27273a" }}
                >
                  Limpar
                </button>
                <button
                  onClick={scrollToReadings}
                  className="px-4 py-2 text-sm rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#a78bfa", color: "#0a0a0f" }}
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
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(99, 102, 241, 0.2)" }}>
                <BookOpen className="h-5 w-5" style={{ color: "#6366f1" }} />
              </div>
              <h2 className="text-2xl font-bold">Sua Leitura</h2>
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
          </section>
        )}

        {/* Empty State */}
        {selectedCards.length === 0 && (
          <section className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: "#1e1e2e" }}>
              <BookOpen className="h-10 w-10" style={{ color: "#a1a1aa" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma carta selecionada
            </h3>
            <p className="max-w-md mx-auto" style={{ color: "#a1a1aa" }}>
              Selecione até 3 cartas acima para ver as interpretações de 15
              mestres do tarô.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid #27273a" }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm" style={{ color: "#a1a1aa" }}>
          <p>
            Interpretações compiladas de Arrien, Cowie, Crowley, Eakins,
            Fairfield, Greer, Noble, Pollack, Sharman-Burke, Stewart, Waite,
            Walker, Wanless, Wirth e Riley.
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
        style={{ backgroundColor: "#a78bfa", color: "#0a0a0f" }}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}

export default App;
