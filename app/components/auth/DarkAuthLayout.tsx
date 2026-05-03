import Image from "next/image";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";

export function DarkAuthLayout({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative min-h-dvh w-full overflow-hidden"
      style={{
        background: "#0a0a14",
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Indigo radial glow at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(129,140,248,0.18), transparent 65%)",
        }}
      />

      {/* Violet glow bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-[60vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(167,139,250,0.12), transparent 65%)",
        }}
      />

      {/* Top hairline accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(129,140,248,0.45), transparent)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-6">
        <div className="flex flex-1 flex-col justify-center py-6">
          {/* Hero icon */}
          <div className="mb-7 flex justify-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 scale-[2.6] rounded-full opacity-70 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${INDIGO}80 0%, transparent 60%)`,
                }}
              />
              <div
                className="flex size-[68px] items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${INDIGO}1f, ${VIOLET}11)`,
                  border: `1px solid ${INDIGO}40`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 36px -10px ${INDIGO}55`,
                }}
              >
                <Image
                  src="/app_icon.svg"
                  alt=""
                  width={36}
                  height={36}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <p
              className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: INDIGO }}
            >
              {kicker}
            </p>
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-white">
              {title}
            </h1>
          </div>

          {children}
        </div>

        <footer className="py-5 text-center">
          <p className="text-[10px] text-white/30">
            secured · encrypted · private
          </p>
        </footer>
      </div>
    </main>
  );
}
