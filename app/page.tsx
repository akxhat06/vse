import { CurrencyLanding } from "./components/CurrencyLanding";

export default function Home() {
  return (
    <CurrencyLanding redirectTo="/login">
      {/* Placeholder while splash runs — dark doc chrome, no white flash */}
      <div className="min-h-dvh bg-[#0b0b1a]" aria-hidden />
    </CurrencyLanding>
  );
}
