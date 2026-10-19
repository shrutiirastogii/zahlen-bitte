import VisualizationRow from "../components/VisualizationRow";
import visualizations from "../data/visualizations.json";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <h1 className="mx-auto max-w-4xl text-center text-4xl leading-tight font-semibold md:text-6xl">
          Germany, one curious chart at a time.
        </h1>
      </section>

      <section aria-label="Visualizations" className="border-t border-ink/20">
        {visualizations.map((visualization, index) => (
          <VisualizationRow
            key={visualization.id}
            number={String(index + 1).padStart(2, "0")}
            question={visualization.question}
            type={visualization.type}
            href={visualization.href}
          />
        ))}
      </section>
    </main>
  );
}
