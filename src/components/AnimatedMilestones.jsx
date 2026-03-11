import React, { useEffect, useState } from "react";

export default function AnimatedMilestones() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setInView(true);
  }, []);

  const milestones = [
    {
      id: 1,
      icon: "⚡",
      label: "Manufacturing Partners",
      value: 300,
      suffix: "+",
      delay: 0,
      color: "#10b981",
      lightColor: "#6ee7b7",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 2,
      icon: "🏭",
      label: "Components Delivered",
      value: 12200,
      suffix: "+",
      delay: 0.15,
      color: "#06b6d4",
      lightColor: "#67e8f9",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      id: 3,
      icon: "✓",
      label: "Reliability Rate",
      value: 92,
      suffix: "%",
      delay: 0.3,
      color: "#8b5cf6",
      lightColor: "#c4b5fd",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 4,
      icon: "📅",
      label: "Years Experience",
      value: 17,
      suffix: "+",
      delay: 0.45,
      color: "#f59e0b",
      lightColor: "#fcd34d",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
        perspective: "1200px",
      }}
    >
      {/* Premium Background with Multiple Layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), " +
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), " +
            "radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)",
          backdropFilter: "blur(15px)",
          borderRadius: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* Animated Background Gradient Orbs */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-50px",
          right: "-50px",
          filter: "blur(40px)",
          animation: `float 6s ease-in-out infinite`,
          animationDelay: "0s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-30px",
          left: "-50px",
          filter: "blur(40px)",
          animation: `float 8s ease-in-out infinite`,
          animationDelay: "1s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "20%",
          right: "10%",
          filter: "blur(40px)",
          animation: `float 7s ease-in-out infinite`,
          animationDelay: "0.5s",
        }}
      />

      {/* Grid Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
          placeItems: "center",
          "@media (max-width: 640px)": {
            gridTemplateColumns: "1fr",
            padding: "1.5rem",
            gap: "1rem",
          },
        }}
      >
        {milestones.map((milestone) => (
          <PremiumMilestoneCard
            key={milestone.id}
            milestone={milestone}
            inView={inView}
          />
        ))}
      </div>

      {/* Floating Particles with Premium Effect */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `hsl(${150 + Math.random() * 30}, 100%, 50%)`,
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            filter: `blur(${Math.random() * 0.5}px)`,
            animation: `floatParticle ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            pointerEvents: "none",
            boxShadow: `0 0 ${5 + Math.random() * 10}px currentColor`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(15px);
          }
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          50% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          90% {
            opacity: 0;
          }
          100% {
            transform: translateY(-200px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.6) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 currentColor;
          }
          50% {
            box-shadow: 0 0 0 10px rgba(currentColor, 0);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px currentColor,
                         0 0 20px currentColor,
                         0 0 30px currentColor;
          }
          50% {
            text-shadow: 0 0 20px currentColor,
                         0 0 40px currentColor,
                         0 0 60px currentColor;
          }
        }

        .premium-card {
          animation: slideInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .milestone-icon {
          animation: bounce 2.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          filter: drop-shadow(0 0 8px currentColor);
          text-shadow: 0 0 20px currentColor;
        }

        .number-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function PremiumMilestoneCard({ milestone, inView }) {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!inView) return;

    const delay = milestone.delay * 1000;
    const timer = setTimeout(() => {
      const duration = 2500;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        setCount(Math.floor(easedProgress * milestone.value));

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
      className="premium-card"
      style={{
        position: "relative",
        borderRadius: "1.5rem",
        overflow: "hidden",
        padding: "2rem 1.5rem",
        textAlign: "center",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))",
        backdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "pointer",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        animationDelay: `${milestone.delay}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Gradient Border Effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.5rem",
          padding: "1.5px",
          background: `linear-gradient(135deg, ${milestone.color}, ${milestone.lightColor}, transparent)`,
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "1.5px",
            borderRadius: "calc(1.5rem - 1.5px)",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))",
            backdropFilter: "blur(20px)",
          }}
        />
      </div>

      {/* Animated Background Glow */}
      <div
        style={{
          position: "absolute",
          inset: "-100%",
          background: `radial-gradient(circle, ${milestone.color}20 0%, transparent 70%)`,
          borderRadius: "50%",
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.4s ease",
          animation: `float 4s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />

      {/* Content Wrapper */}
      <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
        {/* Icon with Premium Styling */}
        <div
          className="milestone-icon"
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            display: "inline-block",
            color: milestone.color,
            textShadow: `0 0 20px ${milestone.color}`,
            filter: `drop-shadow(0 0 12px ${milestone.color})`,
            animationDelay: `${milestone.delay}s`,
          }}
        >
          {milestone.icon}
        </div>

        {/* Counter with Glow Effect */}
        <div
          className="number-glow"
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            background: milestone.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.75rem",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.05em",
            color: milestone.color,
            textShadow: `0 0 20px ${milestone.color}`,
          }}
        >
          {count}
          <span
            style={{
              fontSize: "1.5rem",
              background: milestone.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginLeft: "0.25rem",
            }}
          >
            {milestone.suffix}
          </span>
        </div>

        {/* Premium Label */}
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "rgba(255, 255, 255, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "1rem",
            transition: "color 0.3s ease",
            color: isHovered ? milestone.color : "rgba(255, 255, 255, 0.8)",
          }}
        >
          {milestone.label}
        </div>

        {/* Animated Underline Bar */}
        <div style={{ position: "relative", width: "100%", height: "4px" }}>
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: isHovered ? "100%" : "40%",
              background: milestone.gradient,
              borderRadius: "9999px",
              transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: `0 0 20px ${milestone.color}`,
            }}
          />
        </div>
      </div>

      {/* Corner Accent Lights */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "3px",
          height: "3px",
          background: milestone.color,
          borderRadius: "50%",
          boxShadow: `0 0 10px ${milestone.color}`,
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          width: "3px",
          height: "3px",
          background: milestone.color,
          borderRadius: "50%",
          boxShadow: `0 0 10px ${milestone.color}`,
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}