import React, { useEffect, useState } from "react";

export default function AnimatedMilestones() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Trigger animation when component is visible
    setInView(true);
  }, []);

  const milestones = [
    {
      id: 1,
      icon: "🏭",
      label: "Manufacturing Partners",
      value: 300,
      suffix: "+",
      delay: "0s",
    },
    {
      id: 2,
      icon: "⚙️",
      label: "Components Delivered",
      value: 12200,
      suffix: "+",
      delay: "0.2s",
    },
    {
      id: 3,
      icon: "✓",
      label: "Production Reliability",
      value: 92,
      suffix: "%",
      delay: "0.4s",
    },
    {
      id: 4,
      icon: "📅",
      label: "Years Experience",
      value: 17,
      suffix: "+",
      delay: "0.6s",
    },
  ];

  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Blurred Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10 backdrop-blur-xl rounded-3xl" />

      {/* Animated Grid */}
      <div className="relative z-10 w-full h-full p-8 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          {milestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${
                inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{
                transitionDelay: inView ? milestone.delay : "0s",
              }}
            >
              {/* Card Background with Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 group-hover:border-emerald-400/50 group-hover:from-white/25 group-hover:to-white/10 transition-all duration-500" />

              {/* Animated Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-1" />

              {/* Content */}
              <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
                {/* Icon with Pulse Animation */}
                <div className="mb-3 text-4xl animate-bounce" style={{ animationDelay: milestone.delay }}>
                  {milestone.icon}
                </div>

                {/* Counter with Number Animation */}
                <div className="mb-2">
                  <div className="text-3xl font-bold text-emerald-300 font-mono">
                    {inView ? (
                      <CountUpAnimated
                        end={milestone.value}
                        duration={2}
                        delay={parseFloat(milestone.delay)}
                      />
                    ) : (
                      0
                    )}
                    <span className="text-emerald-400">{milestone.suffix}</span>
                  </div>
                </div>

                {/* Label */}
                <div className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  {milestone.label}
                </div>

                {/* Animated Underline */}
                <div className="mt-3 w-8 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full group-hover:w-12 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Particles Effect (Optional) */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Counter Component with Animation
function CountUpAnimated({ end, duration, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        setCount(Math.floor(progress * end));

        if (progress === 1) {
          clearInterval(interval);
          setCount(end);
        }
      }, 16);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  return <>{count}</>;
}