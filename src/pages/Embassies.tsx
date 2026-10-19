import { Link } from "react-router";

export default function Embassies() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <Link to="/" className="text-sm underline-offset-4 hover:underline">
        ← All visualizations
      </Link>

      <h1 className="mt-8 max-w-4xl text-3xl leading-tight font-semibold md:text-5xl">
        Where does the world have an address in Germany?
      </h1>

      <p className="mt-4 text-ink/70">
        Explore foreign embassies and consulates across Germany.
      </p>

      <div className="mt-10 flex min-h-80 items-center justify-center rounded-lg border border-dashed border-ink/30">
        <p className="text-sm text-ink/60">Map coming next.</p>
      </div>
    </main>
  );
}
