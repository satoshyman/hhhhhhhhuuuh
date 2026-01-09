import { useEffect, useRef, useState } from "react";

export const useSecretUnlock = (
  secretCode: string = "ADMIN",
  tapCount: number = 8,
) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    const handleTap = () => {
      const now = Date.now();

      // Reset if more than 2 seconds passed since last tap
      if (now - lastTapRef.current > 2000) {
        tapCountRef.current = 0;
      }

      lastTapRef.current = now;
      tapCountRef.current++;

      // Unlock after required taps
      if (tapCountRef.current >= tapCount) {
        setIsUnlocked(true);
        tapCountRef.current = 0;
      }
    };

    // Add event listener to document for any tap/click
    document.addEventListener("click", handleTap, true);

    return () => {
      document.removeEventListener("click", handleTap, true);
    };
  }, [tapCount]);

  const lock = () => {
    setIsUnlocked(false);
    tapCountRef.current = 0;
  };

  return { isUnlocked, lock };
};
