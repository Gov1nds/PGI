import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback timeout — if observer hasn't fired in 2.5s, force reveal
    const fallbackTimer = setTimeout(() => {
      setRevealed(true);
    }, 2500);

    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      clearTimeout(fallbackTimer);
      return () => {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
          clearTimeout(fallbackTimer);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold]);

  return [ref, revealed];
}

export function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, revealed] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal-section ${revealed ? "revealed" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
