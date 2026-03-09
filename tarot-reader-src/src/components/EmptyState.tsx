import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onStart: () => void;
}

export function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-10 animate-fade-in overflow-y-auto">

      {/* Top */}
      <div>
        <p className="label mb-6">Desconstrução do Tarô</p>

        <h1 className="heading-display text-5xl mb-6">
          Tarô<br />Quebrado.
        </h1>

        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Um projeto que desmonta o tarô peça por peça.
          Cada par de cartas é lido nas duas direções — porque
          A sobre B não é o mesmo que B sobre A. São 78 cartas,
          todas as combinações possíveis, todas as ordens,
          mapeadas uma a uma em cinco dinâmicas.
        </p>

        <p className="text-sm leading-relaxed max-w-sm mt-3" style={{ color: "var(--color-muted-foreground)" }}>
          Existem projetos que fazem todos os pares.
          Nenhum faz todos os pares nas duas ordens.
        </p>
      </div>

      {/* Dynamics */}
      <div className="py-8">
        <div className="rule mb-5" />
        <p className="label mb-4">Cinco dinâmicas</p>
        <div className="space-y-2.5">
          {[
            { name: "Engendrar", desc: "o que nasce do encontro",       color: "#4a7a64" },
            { name: "Conflito",  desc: "as tensões que emergem",        color: "#984848" },
            { name: "Estagnar",  desc: "o que paralisa",                color: "#5c5e8a" },
            { name: "Regressar", desc: "o que retorna e revisita",      color: "#8a6e2e" },
            { name: "Necessitar",desc: "o que uma carta pede da outra", color: "#3e7880" },
          ].map((d) => (
            <div key={d.name} className="flex items-baseline gap-3">
              <span
                className="heading-display text-base font-semibold w-28 flex-shrink-0"
                style={{ color: d.color }}
              >
                {d.name}
              </span>
              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                {d.desc}
              </span>
            </div>
          ))}
        </div>
        <div className="rule mt-5" />
      </div>

      {/* CTA + stats */}
      <div>
        <button
          onClick={onStart}
          className="touch-target flex items-center gap-2 text-sm font-medium mb-8"
        >
          Iniciar leitura
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex gap-8">
          {[
            { value: "78", label: "Cartas" },
            { value: "12.012", label: "Leituras" },
            { value: "5", label: "Dinâmicas" },
          ].map((s) => (
            <div key={s.label}>
              <div className="heading-display text-2xl">{s.value}</div>
              <div className="label mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
