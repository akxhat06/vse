import { CurrencyLanding } from "./components/CurrencyLanding";

export default function Home() {
  return (
    <CurrencyLanding>
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <header className="border-b border-zinc-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              VSE
            </span>
            <nav className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="#">
                Product
              </a>
              <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="#">
                Pricing
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 py-20">
          <p className="text-sm font-medium tracking-wide text-indigo-600 dark:text-indigo-400">
            Invoices · payments · clients
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Run your billing from one calm dashboard
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Draft branded invoices, set due dates, and follow up when balances
            are outstanding—multi-currency friendly when you need it. Adjust
            layout and routes in{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              app/page.tsx
            </code>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              href="#"
            >
              Get started
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js docs
            </a>
          </div>
        </main>
      </div>
    </CurrencyLanding>
  );
}
