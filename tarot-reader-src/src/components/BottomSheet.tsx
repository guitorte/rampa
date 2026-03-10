import { useEffect, useState, useRef } from "react";
import { useBottomSheet } from "@/hooks/useBottomSheet";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { sheetRef, handlers } = useBottomSheet({ onClose: handleClose });
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function handleClose() {
    setIsClosing(true);
  }

  function handleAnimationEnd() {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }

  // Lock body scroll and manage focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus the first input in the sheet after animation
      const timer = setTimeout(() => {
        const input = sheetRef.current?.querySelector("input");
        input?.focus();
      }, 100);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && !isClosing && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen, isClosing]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Selecionar carta">
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          animation: isClosing
            ? "backdrop-fade-out 200ms ease-out forwards"
            : "backdrop-fade-in 200ms ease-out forwards",
        }}
        onClick={handleClose}
      />

      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 rounded-t-xl flex flex-col md:static md:mx-auto md:my-auto md:rounded-xl md:max-w-[480px] md:max-h-[600px] md:fixed md:inset-0 md:w-full md:h-auto"
        style={{
          backgroundColor: "#ffffff",
          maxHeight: "85dvh",
          animation: isClosing
            ? "sheet-slide-down 300ms ease-in forwards"
            : "sheet-slide-up 300ms ease-out forwards",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        onAnimationEnd={handleAnimationEnd}
        {...handlers}
      >
        <div className="flex justify-center pt-3 pb-2 cursor-grab md:hidden">
          <div
            className="w-10 h-px"
            style={{ backgroundColor: "var(--color-muted)" }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
