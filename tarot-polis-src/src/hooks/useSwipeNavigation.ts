import { useRef, useCallback } from "react";

interface UseSwipeNavigationOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

type Direction = "none" | "horizontal" | "vertical";

const LOCK_THRESHOLD = 10; // px to decide direction

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeNavigationOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const deltaX = useRef(0);
  const direction = useRef<Direction>("none");

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    deltaX.current = 0;
    direction.current = "none";
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    // Decide direction once movement exceeds lock threshold
    if (direction.current === "none") {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < LOCK_THRESHOLD && absDy < LOCK_THRESHOLD) return;

      direction.current = absDx > absDy ? "horizontal" : "vertical";
    }

    if (direction.current === "horizontal") {
      // Prevent vertical scroll while swiping horizontally
      e.preventDefault();
      deltaX.current = dx;
    }
    // If vertical, do nothing — let normal scroll happen
  }, []);

  const onTouchEnd = useCallback(() => {
    if (direction.current === "horizontal" && Math.abs(deltaX.current) > threshold) {
      if (deltaX.current < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }

    direction.current = "none";
    deltaX.current = 0;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
