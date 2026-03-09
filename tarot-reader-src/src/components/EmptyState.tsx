import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onStart: () => void;
}

export function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-10 animate-fade-in overflow-y-auto">

      {/* Top: brand */}
      <div>
        <p className="label mb-6">Leitura interativa do Tarô</p>

        <h1
          className="heading-display text-5xl mb-5"
          style={{ color: "#ede9e4" }}
        >
          O que emerge<br />
          <em style={{ color: "#c4a882" }}>do encontro.</em>
        </h1>

        <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#8a8490" }}>
          Selecione até três cartas. A cada par, cinco dinâmicas revelam o que se gera, conflita, estagna, retorna ou é necessitado.
        </p>
      </div>

      {/* Middle: dynamics as editorial list */}
      <div className="py-8">
        <div className="rule mb-6" />
        <p className="label mb-4">As cinco dinâmicas</p>
        <div className="space-y-3">
          {[
            { name: "Engendrar", desc: "o que nasce do encontro", color: "#6aaa8c" },
            { name: "Conflito",  desc: "as tensões que emergem",  color: "#c27171" },
            { name: "Estagnar",  desc: "o que paralisa",          color: "#7b7fb5" },
            { name: "Regressar", desc: "o que retorna e revisita", color: "#c4943e" },
            { name: "Necessitar",desc: "o que uma carta pede da outra", color: "#5ea0a8" },
          ].map((d) => (
            <div key={d.name} className="flex items-baseline gap-3">
              <span
                className="heading-display text-base font-semibold w-28 flex-shrink-0"
                style={{ color: d.color }}
              >
                {d.name}
              </span>
              <span className="text-xs" style={{ color: "#8a8490" }}>
                {d.desc}
              </span>
            </div>
          ))}
        </div>
        <div className="rule mt-6" />
      </div>

      {/* Bottom: CTA + stats */}
      <div>
        <button
          onClick={onStart}
          className="touch-target flex items-center gap-2 text-sm font-medium mb-8"
          style={{ color: "#c4a882" }}
        >
          Iniciar leitura
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex gap-8">
          {[
            { value: "78", label: "Cartas" },
            { value: "6.006", label: "Combinações" },
            { value: "5", label: "Dinâmicas" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="heading-display text-2xl"
                style={{ color: "#ede9e4" }}
              >
                {s.value}
              </div>
              <div className="label mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
