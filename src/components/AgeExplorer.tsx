import { useState } from "react";
import populationData from "../data/germany-age-distribution.json";

const groups = populationData.ages;
const totalPopulation = groups.reduce(
  (sum, group) => sum + group.population,
  0,
);

// Keep the combined 85+ group out of the single-year bar chart.
const singleYearGroups = groups.filter((group) => !group.openEnded);
const maxPopulation = Math.max(
  ...singleYearGroups.map((group) => group.population),
);

const numberFormatter = new Intl.NumberFormat("en-GB");
const percentFormatter = new Intl.NumberFormat("en-GB", {
  style: "percent",
  maximumFractionDigits: 1,
});

export default function AgeExplorer() {
  const [age, setAge] = useState(32);

  const selectedGroup = groups.find((group) => group.age === age)!;

  const youngerPopulation = groups
    .filter((group) => group.age < age)
    .reduce((sum, group) => sum + group.population, 0);

  const olderPopulation = groups
    .filter((group) => group.age > age)
    .reduce((sum, group) => sum + group.population, 0);

  function updateAge(value: number) {
    if (!Number.isFinite(value)) return;

    setAge(Math.min(85, Math.max(0, Math.round(value))));
  }

  const summaryItems = [
    {
      label: age === 85 ? "People aged 85+" : "People your age",
      value: numberFormatter.format(selectedGroup.population),
      detail: `${percentFormatter.format(
        selectedGroup.population / totalPopulation,
      )} of the population`,
    },
    {
      label: age === 85 ? "People younger than 85" : "Younger than you",
      value: percentFormatter.format(youngerPopulation / totalPopulation),
      detail: `${numberFormatter.format(youngerPopulation)} people`,
    },
    {
      label: age === 85 ? "Within the 85+ group" : "Older than you",
      value:
        age === 85
          ? "Not available"
          : percentFormatter.format(olderPopulation / totalPopulation),
      detail:
        age === 85
          ? "Individual ages above 84 are grouped together."
          : `${numberFormatter.format(olderPopulation)} people`,
    },
  ];

  return (
    <section className="visualization-page age-explorer">
      <header className="visualization-page__header">
        <h1 className="visualization-page__title">Where do you fit?</h1>

        <p className="visualization-page__description">
          Find your place in Germany’s population.
        </p>
      </header>

      <div className="age-explorer__controls">
        <label htmlFor="age-input">How old are you?</label>

        <div className="age-explorer__input-row">
          <input
            id="age-input"
            type="number"
            min={0}
            max={85}
            step={1}
            value={age}
            onChange={(event) => {
              if (event.target.value !== "") {
                updateAge(event.target.valueAsNumber);
              }
            }}
            aria-describedby="age-help"
          />
          <span>{age === 85 ? "years and over" : "years old"}</span>
        </div>

        <input
          className="age-explorer__slider"
          type="range"
          min={0}
          max={85}
          step={1}
          value={age}
          onChange={(event) => updateAge(Number(event.target.value))}
          aria-label="Choose an age"
          aria-valuetext={age === 85 ? "85 and over" : `${age} years`}
        />

        <div className="age-explorer__range-labels" aria-hidden="true">
          <span>0</span>
          <span>85+</span>
        </div>

        <p id="age-help" className="age-explorer__note">
          Age 0 means under one year. Ages 85 and over form one group.
        </p>
      </div>

      <div className="age-explorer__chart-heading">
        <h2>Germany, one age at a time</h2>
        <p>Click a bar to explore an age.</p>
      </div>

      <div className="age-explorer__chart-scroll">
        <div className="age-explorer__chart">
          {singleYearGroups.map((group) => {
            const isSelected = group.age === age;

            return (
              <button
                key={group.age}
                type="button"
                className={`age-explorer__bar ${
                  isSelected ? "age-explorer__bar--selected" : ""
                }`}
                style={{
                  height: `${(group.population / maxPopulation) * 100}%`,
                }}
                onClick={() => setAge(group.age)}
                aria-label={`Age ${group.age}: ${numberFormatter.format(
                  group.population,
                )} people`}
                aria-pressed={isSelected}
                title={`Age ${group.age}: ${numberFormatter.format(
                  group.population,
                )} people`}
              />
            );
          })}
        </div>

        <div className="age-explorer__axis" aria-hidden="true">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>84</span>
        </div>
      </div>

      <p className="age-explorer__note">
        Bar height represents population. The chart shows ages 0–84; the
        combined 85+ group is available through the slider.
      </p>

      <div className="age-explorer__summary" aria-live="polite">
        <h2>{age === 85 ? "People aged 85 and over" : `At age ${age}`}</h2>

        <div className="age-explorer__cards">
          {summaryItems.map((item) => (
            <div className="age-explorer__card" key={item.label}>
              <p>{item.label}</p>
              <div className="age-explorer__value">{item.value}</div>
              <p className="age-explorer__note">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="age-explorer__footer">
        <p>
          Total population: {numberFormatter.format(totalPopulation)}. Younger
          and older counts exclude the selected age group.
        </p>
        <p>
          Source:{" "}
          <a
            href={populationData.metadata.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Destatis · Table 12411-0005
          </a>
          . Reference date: 31 December 2025.
        </p>
        <p>
          Source values carry the flag “e”; its definition still needs to be
          confirmed before publication.
        </p>
      </footer>
    </section>
  );
}
