import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  onStart: () => void;
}

export function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      {/* Ambient */}
      <div className="ambient-bg" />

      {/* Logo / Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.15))",
          border: "1px solid rgba(168, 85, 247, 0.2)",
        }}
      >
        <Sparkles className="h-10 w-10" style={{ color: "#a855f7" }} />
      </div>

      {/* Title */}
      <h1
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="gradient-text">Oraculo</span>
      </h1>

      <p className="text-sm mb-8 max-w-xs" style={{ color: "#a8a0b5" }}>
        Selecione até três cartas e explore as cinco dinâmicas que emergem de cada encontro entre elas.
      </p>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        {[
          { value: "78", label: "Cartas" },
          { value: "6.006", label: "Combinações" },
          { value: "5", label: "Dinâmicas" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-xl font-bold"
              style={{ color: "#a855f7", fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: "#6b6279" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="touch-target flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all"
        style={{
          backgroundColor: "#a855f7",
          color: "#0f0a1a",
          boxShadow: "0 4px 24px rgba(168, 85, 247, 0.3)",
        }}
      >
        <Sparkles className="h-5 w-5" />
        Iniciar Leitura
      </button>

      {/* Dynamics list */}
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {[
          { icon: "✦", name: "Engendrar", color: "#10b981" },
          { icon: "⚔", name: "Conflito", color: "#ef4444" },
          { icon: "◯", name: "Estagnar", color: "#6366f1" },
          { icon: "↺", name: "Regressar", color: "#f59e0b" },
          { icon: "∞", name: "Necessitar", color: "#06b6d4" },
        ].map((d) => (
          <span
            key={d.name}
            className="text-xs px-2 py-1 rounded-md"
            style={{
              color: d.color,
              backgroundColor: `${d.color}10`,
            }}
          >
            {d.icon} {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
