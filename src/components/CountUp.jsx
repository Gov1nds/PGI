import { useEffect, useMemo, useRef, useState } from "react";

function formatIndian(n) {
  // 100000 -> 1,00,000
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export default function CountUp({
  value = 100000,
  suffix = "+",
  duration = 1400,
  format = "indian", // "indian" | "number"
  startOnView = true,
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

    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref}>
      {formatter(display)}
      {suffix}
    </span>
  );
}
