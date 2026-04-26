export function WaveHeader() {
  return (
    <div className="relative h-[min(26vh,220px)] w-full min-h-[168px] overflow-hidden bg-teal-500 sm:h-[min(28vh,240px)] sm:min-h-[188px]">
      <DarkerTealWaves />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
        aria-hidden
      />
      <svg
        className="absolute bottom-0 left-0 h-14 w-full text-white sm:h-[4.5rem]"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 46 Q360 8 720 44 T1440 38 L1440 72 L0 72 Z"
        />
      </svg>
    </div>
  );
}

function DarkerTealWaves() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="none"
        stroke="rgb(13 116 110)"
        strokeWidth="1.2"
        d="M-80 120c160-40 320-20 480 0s320 40 480 20 320-60 480-40"
      />
      <path
        fill="none"
        stroke="rgb(15 118 110)"
        strokeWidth="1"
        d="M-80 80c140-35 280-15 420 10s280 35 420 15 280-45 420-25"
      />
      <path
        fill="none"
        stroke="rgb(17 94 89)"
        strokeWidth="0.9"
        d="M-80 48c120-25 240-10 360 8s240 30 360 12 240-35 360-18"
      />
      <path
        fill="none"
        stroke="rgb(13 116 110)"
        strokeWidth="0.85"
        d="M-80 200c200-30 400-10 600 10s400 30 600 8 400-50 600-28"
      />
    </svg>
  );
}
