"use client";

/* Each bubble is defined by position, size, color, duration and delay.
   All animation is pure CSS — no JS timers. */
const BUBBLES = [
  { left: "8%",  size: 28, color: "rgba(129,140,248,0.18)", dur: "12s", delay: "0s"    },
  { left: "18%", size: 16, color: "rgba(167,139,250,0.22)", dur: "9s",  delay: "1.5s"  },
  { left: "30%", size: 40, color: "rgba(99,102,241,0.14)",  dur: "14s", delay: "3s"    },
  { left: "42%", size: 20, color: "rgba(192,132,252,0.2)",  dur: "10s", delay: "0.8s"  },
  { left: "55%", size: 32, color: "rgba(129,140,248,0.16)", dur: "13s", delay: "2.2s"  },
  { left: "65%", size: 14, color: "rgba(167,139,250,0.25)", dur: "8s",  delay: "4s"    },
  { left: "75%", size: 44, color: "rgba(99,102,241,0.12)",  dur: "15s", delay: "1s"    },
  { left: "85%", size: 22, color: "rgba(139,92,246,0.2)",   dur: "11s", delay: "3.5s"  },
  { left: "93%", size: 18, color: "rgba(129,140,248,0.18)", dur: "9.5s","delay": "2s"  },
  { left: "25%", size: 12, color: "rgba(192,132,252,0.22)", dur: "7.5s","delay": "5s"  },
  { left: "50%", size: 36, color: "rgba(129,140,248,0.1)",  dur: "16s", delay: "0.3s"  },
  { left: "70%", size: 10, color: "rgba(167,139,250,0.28)", dur: "7s",  delay: "6s"    },
];

export function AuthBubbles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="auth-bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 35% 35%, ${b.color.replace(/[\d.]+\)$/, (m) => String(parseFloat(m) * 2) + ")")}, ${b.color})`,
            border: `1px solid ${b.color.replace(/[\d.]+\)$/, "0.35)")}`,
            boxShadow: `inset 0 0 ${b.size * 0.4}px ${b.color.replace(/[\d.]+\)$/, "0.3)")}`,
            ["--dur" as string]: b.dur,
            ["--delay" as string]: b.delay,
          }}
        />
      ))}
    </div>
  );
}
