import { useEffect, useMemo, useRef, useState } from "react";

/**
 * CountUp
 *
 * Props:
 *  - value: number final value
 *  - suffix: string to append (default "+")
 *  - duration: animation duration in ms
 *  - format: "indian" | "number"
 *  - startOnView: boolean (use IntersectionObserver)
 *  - className: optional CSS class for styling the output (e.g., "text-emerald-700")
 *  - ariaLive: aria-live value ("polite" | "assertive" | "off")
 */
function formatIndian(n) {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export default function CountUp({
  value = 100000,
  suffix = "+",
  duration = 1400,
  format = "indian", // "indian" | "number"
  startOnView = true,
  className = "",
  ariaLive = "polite",
}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(!startOnView);
  const [display, setDisplay] = useState(0);

  const formatter = useMemo(() => {
    if (format === "indian") return (n) => formatIndian(n);
    return (n) => new Intl.NumberFormat().format(Math.round(n));
  }, [format]);

  useEffect(() => {
    if (!startOnView) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!seen) return;

    const prefersReduced = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    const to = Number(value) || 0;

    if (prefersReduced) {
      setDisplay(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / Math.max(16, duration));
      const eased = easeOutCubic(t);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className={className} aria-live={ariaLive}>
      {formatter(display)}
      {suffix}
    </span>
  );
}