import CauseOfDeath from "../components/CauseOfDeath";

export default function Deaths() {
  return (
    <main className="visualization-page">
      <header className="visualization-page__header">
        <h1 className="visualization-page__title">
          How Germany dies, age by age?
        </h1>

        <p className="visualization-page__description">
          Explore how causes of death differ across age groups. Germany · 2025.
        </p>
      </header>

      <CauseOfDeath />
    </main>
  );
}
