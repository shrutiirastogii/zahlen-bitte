import { useMemo, useState } from "react";
import { area, curveLinear, stack, stackOffsetSilhouette } from "d3-shape";
import data from "../data/deathsGermany.json";
import "./CauseOfDeath.css";

type View = "everyone" | "female" | "male";
const tabs: { key: View; label: string }[] = [
  { key: "everyone", label: "Everyone" },
  { key: "female", label: "Female" },
  { key: "male", label: "Male" },
];
const number = new Intl.NumberFormat("en-GB");
const shortAge = (label: string) => {
  if (label === "unter 1 Jahr") return "Under 1";
  if (label === "85 Jahre und mehr") return "85+";
  const match = label.match(/(\d+) bis unter (\d+)/);
  return match ? `${match[1]}–${Number(match[2]) - 1}` : label;
};
const keys = data.categories.map((category) => category.key);
function layersFor(view: View) {
  const records = data.views[view].ageGroups.map((row) =>
    Object.fromEntries(keys.map((key) => [key, Number(row[key as keyof typeof row])])),
  );
  return stack<Record<string, number>>()
    .keys(keys)
    .offset(stackOffsetSilhouette)(records);
}
// Shared scale across all three selections.
const allLayers = tabs.flatMap((tab) => layersFor(tab.key));
const extent = Math.max(...allLayers.flatMap((layer) =>
  layer.flatMap((point) => [Math.abs(point[0]), Math.abs(point[1])]),
)) * 1.06;
const W = 1040, H = 500, left = 24, right = 24, top = 20, bottom = 440;
const y = (value: number) => bottom - ((value + extent) / (extent * 2)) * (bottom - top);

export default function CausesOfDeath() {
  const [view, setView] = useState<View>("everyone");
  const [selected, setSelected] = useState(11);
  const [highlight, setHighlight] = useState<string | null>(null);
  const rows = data.views[view].ageGroups;
  const layers = useMemo(() => layersFor(view), [view]);
  const x = (index: number) => left + index * (W - left - right) / (rows.length - 1);
  const path = area<(typeof layers)[number][number]>()
    .x((_, index) => x(index))
    .y0((point) => y(point[0]))
    .y1((point) => y(point[1]))
    .curve(curveLinear);
  const current = rows[selected];
  const label = tabs.find((tab) => tab.key === view)!.label;
  const countFor = (key: string) => Number(current[key as keyof typeof current]);

  return (
    <main className="visualization-page deaths-page">
      <header className="visualization-page__header">
        <h1 className="visualization-page__title">What do people die from in Germany?</h1>
        <p className="visualization-page__description">
          Explore how causes of death differ across age groups. Germany · 2025.
        </p>
      </header>

      <div className="deaths-switch" role="group" aria-label="Select sex breakdown">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" aria-pressed={view === tab.key}
            onClick={() => setView(tab.key)}>{tab.label}</button>
        ))}
      </div>
      <p className="deaths-intro"><strong>{number.format(data.views[view].publishedTotal)}</strong>
        {" "}published deaths · {label}</p>
      <p className="deaths-note">Each band is a cause group. Its thickness represents deaths in that age group—not an individual's risk of dying.</p>

      <div className="deaths-chart-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} className="deaths-chart" role="img"
          aria-label={`Causes of death by age group, ${label}, Germany 2025. Exact values are in the table below.`}>
          {rows.map((row, index) => (
            <line key={row.ageLabel} x1={x(index)} x2={x(index)} y1={top} y2={bottom}
              stroke="currentColor" opacity="0.1" />
          ))}
          {layers.map((layer, index) => (
            <path key={layer.key} d={path(layer) || ""}
              fill={data.categories[index].color} stroke="var(--background)" strokeWidth="0.7"
              opacity={highlight && highlight !== layer.key ? 0.2 : 1}>
              <title>{data.categories[index].label}</title>
            </path>
          ))}
          <line x1={x(selected)} x2={x(selected)} y1={top} y2={bottom}
            stroke="currentColor" strokeDasharray="4 4" opacity="0.8" />
          {rows.map((row, index) => (
            <g key={row.ageLabel}>
              <text x={x(index)} y={463} textAnchor="middle" fill="currentColor" fontSize="11">
                {shortAge(row.ageLabel)}
              </text>
              <rect x={x(index) - (W - left - right) / (rows.length - 1) / 2}
                y={top} width={(W - left - right) / (rows.length - 1)} height={bottom - top}
                fill="transparent" onPointerEnter={() => setSelected(index)}
                onClick={() => setSelected(index)} />
            </g>
          ))}
        </svg>
      </div>
      <p className="deaths-note">Age groups are equally spaced categories, not a continuous age scale. Under 1, 1–14 and 85+ cover different age spans. Straight connections show grouped observations; they are not estimates for intermediate ages.</p>

      <div className="deaths-legend" role="group" aria-label="Highlight a cause group">
        {data.categories.map((category) => (
          <button key={category.key} type="button" aria-pressed={highlight === category.key}
            onClick={() => setHighlight(highlight === category.key ? null : category.key)}>
            <span style={{ background: category.color }} />{category.label}
          </button>
        ))}
      </div>

      <section className="deaths-details" aria-label="Exact counts for selected age group">
        <label htmlFor="deaths-age">Explore an age group</label>
        <select id="deaths-age" value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
          {rows.map((row, index) => <option key={row.ageLabel} value={index}>{shortAge(row.ageLabel)}</option>)}
        </select>
        <h2>Age {shortAge(current.ageLabel)} · {label}</h2>
        <p>{number.format(current.total)} published deaths in this age group.</p>
        <table>
          <caption>Published counts and derived remainder for the selected age group</caption>
          <thead><tr><th scope="col">Cause group</th><th scope="col">Deaths</th></tr></thead>
          <tbody>{data.categories.map((category) => (
            <tr key={category.key}><th scope="row">{category.label}</th>
              <td>{number.format(countFor(category.key))}</td></tr>
          ))}</tbody>
        </table>
      </section>
      <footer className="deaths-footer">
        <p>Source: <a href={data.metadata.sourceUrl} target="_blank" rel="noreferrer">Destatis · {data.metadata.tableCode}</a>. Year: 2025.</p>
        <p>{data.metadata.note}</p>
        <p>Counts are subject to statistical disclosure control and may not add exactly across sex or age breakdowns. Everyone uses the published combined counts, not the sum of Female and Male.</p>
        <p>Unknown age is excluded from the chart; the source reports a dash in that category. Broad cause groups are used to avoid double-counting parent categories and their subcategories.</p>
      </footer>
    </main>
  );
}