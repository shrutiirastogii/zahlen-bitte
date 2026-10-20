import EmbassyMap from "../components/EmbassyMap";

export default function Embassies() {
  return (
    <main className="visualization-page">
      <header className="visualization-page__header">
        <h1 className="visualization-page__title">
          Where does the world have an address in Berlin?
        </h1>

        <p className="visualization-page__description">
          Explore foreign embassies across Berlin.
        </p>
      </header>

      <EmbassyMap />
    </main>
  );
}
