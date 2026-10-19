import EmbassyMap from "../components/EmbassyMap";

export default function Embassies() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">

      <h1 className="mt-8 max-w-4xl text-3xl leading-tight font-semibold md:text-5xl">
        Where does the world have an address in Berlin?
      </h1>

      <p className="mt-4 text-ink/70">
        Explore foreign embassies across Berlin.
      </p>

      <div className="mt-10">
        <EmbassyMap />
      </div>
    </main>
  );
}
