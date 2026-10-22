import { useId, useMemo, useState } from "react";
import { area, curveBumpX, stack, stackOffsetSilhouette } from "d3-shape";
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
    Object.fromEntries(
      keys.map((key) => [key, Number(row[key as keyof typeof row])]),
    ),
  );
  return stack<Record<string, number>>()
    .keys(keys)
    .offset(stackOffsetSilhouette)(records);
}
// Shared scale across all three selections.
const allLayers = tabs.flatMap((tab) => layersFor(tab.key));
const extent =
  Math.max(
    ...allLayers.flatMap((layer) =>
      layer.flatMap((point) => [Math.abs(point[0]), Math.abs(point[1])]),
    ),
  ) * 1.06;
const W = 1040,
  H = 500,
  left = 24,
  right = 24,
  top = 20,
  bottom = 440;
export default function CausesOfDeath() {
  const [view, setView] = useState<View>("everyone");
  const [selected, setSelected] = useState(11);
  const [highlight, setHighlight] = useState<string | null>(null);
  const rows = data.views[view].ageGroups;
  const layers = useMemo(() => layersFor(view), [view]);

  const plotClipId = `deaths-plot-${useId().replace(/:/g, "")}`;

  const verticalZoom = 5;

  const y = (value: number) => {
    const center = (top + bottom) / 2;

    const pixelsPerDeath = ((bottom - top) / (extent * 2)) * verticalZoom;

    return center - value * pixelsPerDeath;
  };

  const x = (index: number) =>
    left + (index * (W - left - right)) / (rows.length - 1);
  const path = area<(typeof layers)[number][number]>()
    .x((_, index) => x(index))
    .y0((point) => y(point[0]))
    .y1((point) => y(point[1]))
    .curve(curveBumpX);
  const label = tabs.find((tab) => tab.key === view)!.label;

  return (
    <>
      <div
        className="deaths-switch"
        role="group"
        aria-label="Select sex breakdown"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={view === tab.key}
            onClick={() => setView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="deaths-intro">
        <strong>{number.format(data.views[view].publishedTotal)}</strong>{" "}
        published deaths · {label}
      </p>
      <p className="deaths-note">
        Each band is a cause group. Its thickness represents deaths in that age
        group—not an individual's risk of dying.
      </p>

      <div className="deaths-chart-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="deaths-chart"
          role="img"
          aria-label={`Causes of death by age group, ${label}, Germany 2025. Exact values are in the table below.`}
        >
          <defs>
            <clipPath id={plotClipId}>
              <rect
                x={left}
                y={top}
                width={W - left - right}
                height={bottom - top}
              />
            </clipPath>
          </defs>
          {rows.map((row, index) => (
            <line
              key={row.ageLabel}
              x1={x(index)}
              x2={x(index)}
              y1={top}
              y2={bottom}
              stroke="currentColor"
              opacity="0.1"
            />
          ))}
          <g clipPath={`url(#${plotClipId})`}>
            {layers.map((layer, index) => (
              <path
                key={layer.key}
                d={path(layer) || ""}
                fill={data.categories[index].color}
                stroke="none"
                opacity={highlight && highlight !== layer.key ? 0.2 : 1}
              >
                <title>{data.categories[index].label}</title>
              </path>
            ))}
          </g>
          <line
            x1={x(selected)}
            x2={x(selected)}
            y1={top}
            y2={bottom}
            stroke="currentColor"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          {rows.map((row, index) => (
            <g key={row.ageLabel}>
              <text
                x={x(index)}
                y={463}
                textAnchor="middle"
                fill="currentColor"
                fontSize="11"
              >
                {shortAge(row.ageLabel)}
              </text>
              <rect
                x={x(index) - (W - left - right) / (rows.length - 1) / 2}
                y={top}
                width={(W - left - right) / (rows.length - 1)}
                height={bottom - top}
                fill="transparent"
                onPointerEnter={() => setSelected(index)}
                onClick={() => setSelected(index)}
              />
            </g>
          ))}
        </svg>
      </div>
      <p className="deaths-note">
        Smooth curves connect the age-group observations for readability; they
        do not represent estimates for intermediate ages.
      </p>

      <div
        className="deaths-legend"
        role="group"
        aria-label="Highlight a cause group"
      >
        {data.categories.map((category) => (
          <button
            key={category.key}
            type="button"
            aria-pressed={highlight === category.key}
            onClick={() =>
              setHighlight(highlight === category.key ? null : category.key)
            }
          >
            <span style={{ background: category.color }} />
            {category.label}
          </button>
        ))}
      </div>

      <details className="deaths-data">
        <summary>
          <span className="deaths-data__closed">Table +</span>
          <span className="deaths-data__open">Table -</span>
        </summary>

        <p className="deaths-data__context">
          {label} · Germany · {data.metadata.year}
        </p>

        <div
          className="deaths-data__scroll"
          role="region"
          aria-label={`Deaths by cause and age group: ${label}`}
          tabIndex={0}
        >
          <table className="deaths-data__table">
            <caption>
              Deaths by cause group and age group. Scroll horizontally to see
              all ages. Remaining causes is a derived remainder.
            </caption>

            <thead>
              <tr>
                <th scope="col">Cause group</th>

                {data.views[view].ageGroups.map((row) => (
                  <th key={row.ageLabel} scope="col">
                    {shortAge(row.ageLabel)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.categories.map((category) => (
                <tr key={category.key}>
                  <th scope="row">
                    <span className="deaths-data__cause">
                      <span
                        className="deaths-data__dot"
                        style={{ backgroundColor: category.color }}
                        aria-hidden="true"
                      />

                      <span>{category.label}</span>
                    </span>
                  </th>

                  {data.views[view].ageGroups.map((row) => {
                    const value = row[category.key as keyof typeof row];

                    return (
                      <td key={row.ageLabel}>
                        {typeof value === "number"
                          ? number.format(value)
                          : "Not available"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <th scope="row">Published total</th>

                {data.views[view].ageGroups.map((row) => (
                  <td key={row.ageLabel}>{number.format(row.total)}</td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </details>
      <footer className="deaths-footer">
        <p>
          Source:{" "}
          <a href={data.metadata.sourceUrl} target="_blank" rel="noreferrer">
            Destatis · {data.metadata.tableCode}
          </a>
          . Year: 2025.
        </p>
        <p>{data.metadata.note}</p>
        <p>
          Counts are subject to statistical disclosure control and may not add
          exactly across sex or age breakdowns. Everyone uses the published
          combined counts, not the sum of Female and Male.
        </p>
        <p>
          Unknown age is excluded from the chart; the source reports a dash in
          that category. Broad cause groups are used to avoid double-counting
          parent categories and their subcategories.
        </p>
      </footer>
    </>
  );
}
