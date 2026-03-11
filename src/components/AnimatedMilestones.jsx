import React, { useEffect, useState } from "react";

export default function AnimatedMilestones() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setInView(true);
  }, []);

  const milestones = [
    {
      id: 1,
      icon: "🏭",
      label: "Manufacturing Partners",
      value: 300,
      suffix: "+",
      delay: 0,
    },
    {
      id: 2,
      icon: "⚙️",
      label: "Components Delivered",
      value: 12200,
      suffix: "+",
      delay: 0.2,
    },
    {
      id: 3,
      icon: "✓",
      label: "Production Reliability",
      value: 92,
      suffix: "%",
      delay: 0.4,
    },
    {
      id: 4,
      icon: "📅",
      label: "Years Experience",
      value: 17,
      suffix: "+",
      delay: 0.6,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Blurred Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.08), rgba(168, 85, 247, 0.12))",
          backdropFilter: "blur(12px)",
          borderRadius: "1.5rem",
        }}
      />

      {/* Content Grid */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          placeItems: "center",
        }}
      >
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            inView={inView}
          />
        ))}
      </div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            background: "rgba(16, 185, 129, 0.3)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.2,
            animation: `pulse 3s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .milestone-card {
          animation: slideInScale 0.6s ease-out forwards;
        }

        .milestone-icon {
          animation: bounce 2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

function MilestoneCard({ milestone, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const delay = milestone.delay * 1000;
    const timer = setTimeout(() => {
      const duration = 2000;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCount(Math.floor(progress * milestone.value));

        if (progress === 1) {
          clearInterval(interval);
          setCount(milestone.value);
        }
      }, 16);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [inView, milestone.value, milestone.delay]);

  return (
    <div
      className="milestone-card"
      style={{
        position: "relative",
        borderRadius: "1rem",
        overflow: "hidden",
        padding: "1.5rem",
        textAlign: "center",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        animationDelay: `${milestone.delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.12))";
        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
        e.currentTarget.style.boxShadow =
          "0 0 20px rgba(16, 185, 129, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08))";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="milestone-icon"
        style={{
          fontSize: "2.5rem",
          marginBottom: "0.75rem",
          animationDelay: `${milestone.delay}s`,
        }}
      >
        {milestone.icon}
      </div>

      {/* Counter Value */}
      <div
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#22c55e",
          fontFamily: "monospace",
          marginBottom: "0.5rem",
        }}
      >
        {count}
        <span style={{ color: "#4ade80" }}>{milestone.suffix}</span>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "rgba(255, 255, 255, 0.85)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.75rem",
        }}
      >
        {milestone.label}
      </div>

      {/* Underline */}
      <div
        style={{
          width: "2rem",
          height: "0.25rem",
          background: "linear-gradient(90deg, #22c55e, #4ade80)",
          borderRadius: "9999px",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}