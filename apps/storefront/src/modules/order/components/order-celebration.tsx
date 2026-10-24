
"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

type Particle = {
  id: number
  angle: number
  distance: number
  delay: number
  duration: number
  size: number
  color: string
  shape: "spark" | "confetti" | "circle"
  rotation: number
}

const COLORS = [
  "#ffffff",
  "#fde047",
  "#fbbf24",
  "#fb7185",
  "#f472b6",
  "#c084fc",
  "#a78bfa",
  "#60a5fa",
  "#67e8f9",
  "#6ee7b7",
  "#34d399",
  "#ff8a5b",
]

export default function OrderCelebration() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Several fireworks launch from the thank-you banner center.
    const fireworks: Particle[] = Array.from(
      { length: 240 },
      (_, index) => {
        const wave = Math.floor(index / 80)
        const angle = Math.random() * Math.PI * 2

        return {
          id: index,
          angle,
          distance: 100 + Math.random() * 420,
          delay: wave * 0.42 + Math.random() * 0.35,
          duration: 1.1 + Math.random() * 1.1,
          size: 3 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: Math.random() > 0.45 ? "spark" : "circle",
          rotation: Math.random() * 900 - 450,
        }
      }
    )

    // Additional colorful confetti falls across the screen.
    const confetti: Particle[] = Array.from(
      { length: 180 },
      (_, index) => ({
        id: 240 + index,
        angle: Math.random() * Math.PI * 2,
        distance: 160 + Math.random() * 600,
        delay: 0.3 + Math.random() * 1.7,
        duration: 2.2 + Math.random() * 2,
        size: 5 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: "confetti",
        rotation: Math.random() * 1400 - 700,
      })
    )

    setParticles([...fireworks, ...confetti])

    const timeout = window.setTimeout(() => {
      setParticles([])
    }, 6500)

    return () => window.clearTimeout(timeout)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="order-fireworks" aria-hidden="true">
      <style>{`
        .order-fireworks {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          pointer-events: none;
          contain: strict;
        }

        .order-firework-particle {
          position: absolute;
          left: var(--start-x);
          top: var(--start-y);
          opacity: 0;
          will-change: transform, opacity;
          animation-fill-mode: both;
        }

        .order-firework-spark {
          animation-name: thank-you-firework;
          animation-timing-function: cubic-bezier(.12,.55,.25,1);
        }

        .order-firework-confetti {
          animation-name: thank-you-confetti;
          animation-timing-function: cubic-bezier(.18,.65,.3,1);
        }

        @keyframes thank-you-firework {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.2) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          65% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--move-x)),
                calc(-50% + var(--move-y))
              )
              scale(.15)
              rotate(var(--rotation));
          }
        }

        @keyframes thank-you-confetti {
          0% {
            opacity: 0;
            transform: translate3d(0, -25px, 0) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: .9;
          }
          100% {
            opacity: 0;
            transform:
              translate3d(var(--move-x), var(--move-y), 0)
              rotate(var(--rotation));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .order-firework-particle {
            animation-duration: .8s !important;
          }
        }
      `}</style>

      {particles.map((particle) => {
        const isFirework = particle.shape !== "confetti"

        // Fireworks originate at the center of the thank-you banner.
        // Confetti starts across the full viewport.
        const startX = isFirework ? 50 : (particle.id * 37) % 100
        const startY = isFirework ? 34 : -5 - (particle.id % 20)

        const moveX = Math.cos(particle.angle) * particle.distance
        const moveY = isFirework
          ? Math.sin(particle.angle) * particle.distance
          : 750 + Math.random() * 350

        const style = {
          "--start-x": `${startX}%`,
          "--start-y": `${startY}%`,
          "--move-x": `${moveX}px`,
          "--move-y": `${moveY}px`,
          "--rotation": `${particle.rotation}deg`,
          width: isFirework ? `${particle.size}px` : `${particle.size * 0.8}px`,
          height: isFirework
            ? `${particle.size * 2.5}px`
            : `${particle.size * 1.8}px`,
          backgroundColor: particle.color,
          borderRadius:
            particle.shape === "circle"
              ? "50%"
              : particle.shape === "spark"
                ? "999px"
                : "2px",
          boxShadow: `0 0 10px ${particle.color}`,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
          transformOrigin: "center",
        } as CSSProperties

        return (
          <span
            key={particle.id}
            className={`order-firework-particle ${
              isFirework
                ? "order-firework-spark"
                : "order-firework-confetti"
            }`}
            style={style}
          />
        )
      })}
    </div>
  )
}
