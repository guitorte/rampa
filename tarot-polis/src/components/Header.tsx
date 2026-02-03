import { Moon, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-1/2 w-40 h-40 bg-mystic/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/80 rounded-full border border-border">
            <Moon className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Dicionário de Interpretações
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-mystic bg-clip-text text-transparent">
              Tarô
            </span>
            <span className="text-foreground"> Interpretativo</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore interpretações de{" "}
            <span className="text-primary font-medium">15 mestres do tarô</span>,
            de Waite a Crowley, de Pollack a Noble. Selecione suas cartas e
            descubra múltiplas perspectivas.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>22 Arcanos Maiores</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-arcana" />
              <span>56 Arcanos Menores</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-mystic" />
              <span>15 Autores</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
