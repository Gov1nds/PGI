import React, { useEffect, useState } from "react";

export default function PremiumMetricsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    {
      id: 1,
      value: 300,
      suffix: "+",
      label: "Global Manufacturing Partners",
      icon: "🌍",
      accentColor: "#10b981",
      delay: 0.1,
    },
    {
      id: 2,
      value: 12200,
      suffix: "+",
      label: "Components Successfully Delivered",
      icon: "📦",
      accentColor: "#06b6d4",
      delay: 0.2,
    },
    {
      id: 3,
      value: 92,
      suffix: "%",
      label: "Production Quality Assurance",
      icon: "✓",
      accentColor: "#8b5cf6",
      delay: 0.3,
    },
    {
      id: 4,
      value: 17,
      suffix: "+",
      label: "Years Industry Leadership",
      icon: "⭐",
      accentColor: "#f59e0b",
      delay: 0.4,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "420px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Premium Background with Mesh Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%), " +
            "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), " +
            "radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)",
          backdropFilter: "blur(8px)",
          borderRadius: "1.75rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      />

      {/* Animated Grid Lines (Premium Design Pattern) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 25}%`}
            x2="100%"
            y2={`${(i + 1) * 25}%`}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1"
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 25}%`}
            y1="0"
            x2={`${(i + 1) * 25}%`}
            y2="100%"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Metrics Grid */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          padding: "2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.5rem",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {metrics.map((metric) => (
          <CorporateMetricCard
            key={metric.id}
            metric={metric}
            isVisible={isVisible}
          />
        ))}
      </div>

      <style>{`
        @keyframes corporateFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes subtleGlow {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(16, 185, 129, 0.08),
              0 0 40px rgba(16, 185, 129, 0.04);
          }
          50% {
            box-shadow: 
              0 0 30px rgba(16, 185, 129, 0.12),
              0 0 60px rgba(16, 185, 129, 0.06);
          }
        }

        @keyframes slideUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: 2px;
            opacity: 1;
          }
        }

        .metric-card-enter {
          animation: corporateFadeIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .metric-accent-line {
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}

function CorporateMetricCard({ metric, isVisible }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const startDelay = metric.delay * 1000;
    const timer = setTimeout(() => {
      const duration = 2200;
      const startTime = Date.now();

      const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic easing for smooth, professional feel
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        setDisplayValue(Math.floor(easedProgress * metric.value));

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        } else {
          setDisplayValue(metric.value);
        }
      };

      requestAnimationFrame(updateValue);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [isVisible, metric.value, metric.delay]);

  return (
    <div
      className="metric-card-enter"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.75rem 1.25rem",
        borderRadius: "1.25rem",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        cursor: "pointer",
        animationDelay: `${metric.delay}s`,
        minHeight: "180px",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))";
        e.currentTarget.style.borderColor = `${metric.accentColor}40`;
        e.currentTarget.style.boxShadow = `0 0 30px ${metric.accentColor}15`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Accent Top Line */}
      <div
        className="metric-accent-line"
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${metric.accentColor}, transparent)`,
          borderRadius: "9999px",
          animationDelay: `${metric.delay + 0.2}s`,
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: "2.25rem",
          marginBottom: "0.75rem",
          display: "inline-block",
          opacity: 0.9,
        }}
      >
        {metric.icon}
      </div>

      {/* Large Number Counter */}
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: metric.accentColor,
          fontFamily: "'Courier New', 'Monaco', monospace",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {displayValue.toLocaleString()}
        <span
          style={{
            fontSize: "1.25rem",
            marginLeft: "0.15rem",
            color: metric.accentColor,
            opacity: 0.8,
          }}
        >
          {metric.suffix}
        </span>
      </div>

      {/* Label Text */}
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: "0.75rem",
          lineHeight: 1.4,
          maxWidth: "90%",
        }}
      >
        {metric.label}
      </div>

      {/* Subtle Bottom Glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${metric.accentColor}30, transparent)`,
          borderRadius: "9999px",
          opacity: 0.5,
        }}
      />
    </div>
  );
}