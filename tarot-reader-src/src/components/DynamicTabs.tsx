import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DYNAMICS_ORDER, DYNAMICS_INFO } from "@/data";
import type { DynamicKey } from "@/data";

interface DynamicTabsProps {
  activeDynamic: DynamicKey;
  onDynamicChange: (dynamic: DynamicKey) => void;
}

export function DynamicTabs({ activeDynamic, onDynamicChange }: DynamicTabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeDynamic]);

  return (
    <div
      className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide"
      style={{ borderBottom: "1px solid #2a1f3d" }}
    >
      {DYNAMICS_ORDER.map((key) => {
        const info = DYNAMICS_INFO[key];
        const isActive = key === activeDynamic;

        return (
          <button
            key={key}
            ref={isActive ? activeRef : undefined}
            onClick={() => onDynamicChange(key)}
            className={cn(
              "touch-target flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            )}
            style={
              isActive
                ? {
                    backgroundColor: info.color,
                    color: "#0f0a1a",
                    boxShadow: `0 2px 12px ${info.color}30`,
                  }
                : {
                    backgroundColor: "#1e1530",
                    color: "#a8a0b5",
                  }
            }
          >
            <span className="text-base leading-none">{info.icon}</span>
            <span>{info.name}</span>
          </button>
        );
      })}
    </div>
  );
}
