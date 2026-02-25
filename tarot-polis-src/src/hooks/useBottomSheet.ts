import { useRef, useCallback } from "react";

interface UseBottomSheetOptions {
  onClose: () => void;
  threshold?: number;
}

export function useBottomSheet({ onClose, threshold = 0.3 }: UseBottomSheetOptions) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow drag from the handle area (top 48px)
    const touch = e.touches[0];
    const rect = sheetRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relativeY = touch.clientY - rect.top;
    if (relativeY > 48) return;

    isDragging.current = true;
    startY.current = touch.clientY;
    currentY.current = 0;

    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return;

    const deltaY = e.touches[0].clientY - startY.current;
    // Only allow dragging downward
    currentY.current = Math.max(0, deltaY);
    sheetRef.current.style.transform = `translateY(${currentY.current}px)`;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current || !sheetRef.current) return;

    isDragging.current = false;
    sheetRef.current.style.transition = "transform 300ms ease-out";

    const sheetHeight = sheetRef.current.offsetHeight;
    if (currentY.current > sheetHeight * threshold) {
      onClose();
    } else {
      sheetRef.current.style.transform = "translateY(0)";
    }

    currentY.current = 0;
  }, [onClose, threshold]);

  return {
    sheetRef,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
