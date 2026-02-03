import { Moon, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(167, 139, 250, 0.1), transparent, transparent)" }}
      />
      <div
        className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(167, 139, 250, 0.2)" }}
      />
      <div
        className="absolute top-20 right-20 w-24 h-24 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.2)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ backgroundColor: "rgba(30, 30, 46, 0.8)", borderColor: "#27273a" }}
          >
            <Moon className="h-4 w-4" style={{ color: "#a78bfa" }} />
            <span className="text-sm" style={{ color: "#a1a1aa" }}>
              Dicionário de Interpretações
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #a78bfa, #6366f1, #8b5cf6)" }}
            >
              Tarô
            </span>
            <span style={{ color: "#fafafa" }}> Interpretativo</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#a1a1aa" }}>
            Explore interpretações de{" "}
            <span className="font-medium" style={{ color: "#a78bfa" }}>15 mestres do tarô</span>,
            de Waite a Crowley, de Pollack a Noble. Selecione suas cartas e
            descubra múltiplas perspectivas.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#a1a1aa" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#fbbf24" }} />
              <span>22 Arcanos Maiores</span>
            </div>
            <div className="h-4 w-px" style={{ backgroundColor: "#27273a" }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: "#a1a1aa" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#ec4899" }} />
              <span>56 Arcanos Menores</span>
            </div>
            <div className="h-4 w-px" style={{ backgroundColor: "#27273a" }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: "#a1a1aa" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#8b5cf6" }} />
              <span>15 Autores</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
