import { Layers, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(212, 165, 116, 0.1), transparent, transparent)" }}
      />
      <div
        className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(212, 165, 116, 0.15)" }}
      />
      <div
        className="absolute top-20 right-20 w-24 h-24 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(124, 111, 91, 0.15)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ backgroundColor: "rgba(37, 37, 50, 0.8)", borderColor: "#2d2d3a" }}
          >
            <Layers className="h-4 w-4" style={{ color: "#d4a574" }} />
            <span className="text-sm" style={{ color: "#9ca3af" }}>
              Baralho Petit Lenormand
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #d4a574, #7c6f5b, #d4a574)" }}
            >
              Lenormand
            </span>
            <span style={{ color: "#f5f5f5" }}> Interpretativo</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#9ca3af" }}>
            Explore interpretações de{" "}
            <span className="font-medium" style={{ color: "#d4a574" }}>5 tradições diferentes</span>,
            de Rana George a Caitlin Matthews. Selecione suas cartas e
            descubra como elas se combinam para formar sentenças.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#4ade80" }} />
              <span>36 Cartas</span>
            </div>
            <div className="h-4 w-px" style={{ backgroundColor: "#2d2d3a" }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#d4a574" }} />
              <span>5 Tradições</span>
            </div>
            <div className="h-4 w-px" style={{ backgroundColor: "#2d2d3a" }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#c084fc" }} />
              <span>Sistema de Combinações</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
