import fs from "node:fs/promises";

const input = "src/data/berlinEmbassies.json";
const output = "src/data/berlinEmbassies.json";

const embassies = JSON.parse(await fs.readFile(input, "utf8"));

for (const embassy of embassies) {
  if (embassy.coordinates) continue;

  const query = encodeURIComponent(`${embassy.address}, Germany`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1&countrycodes=de`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "BerlinEmbassiesMap/1.0 (personal project)",
    },
  });

  if (!response.ok) {
    console.error(`Failed: ${embassy.country} (${response.status})`);
    continue;
  }

  const results = await response.json();

  if (results.length === 0) {
    console.warn(`No result: ${embassy.country} — ${embassy.address}`);
    continue;
  }

  const result = results[0];

  embassy.coordinates = [
    Number(result.lon),
    Number(result.lat),
  ];
  embassy.geocodedDisplayName = result.display_name;
  embassy.verified = false; // keep false until spot-checked

  console.log(`Geocoded ${embassy.country}: ${result.display_name}`);

  await new Promise((resolve) => setTimeout(resolve, 1100));
}

await fs.writeFile(output, JSON.stringify(embassies, null, 2));
console.log("Done. Coordinates saved.");