import { useEffect, useState } from "react";
import { useBottomSheet } from "@/hooks/useBottomSheet";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { sheetRef, handlers } = useBottomSheet({ onClose: handleClose });

  function handleClose() {
    setIsClosing(true);
  }

  function handleAnimationEnd() {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50">
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
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
        style={{
          backgroundColor: "#1a1228",
          maxHeight: "85dvh",
          animation: isClosing
            ? "sheet-slide-down 300ms ease-in forwards"
            : "sheet-slide-up 300ms ease-out forwards",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        onAnimationEnd={handleAnimationEnd}
        {...handlers}
      >
        <div className="flex justify-center pt-3 pb-2 cursor-grab">
          <div
            className="w-12 h-1.5 rounded-full"
            style={{ backgroundColor: "rgba(168, 160, 181, 0.3)" }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
