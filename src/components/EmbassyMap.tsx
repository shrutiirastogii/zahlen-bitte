import { useEffect, useRef } from "react";
import { Map, NavigationControl, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import embassies from "../data/berlinEmbassies.json";
import * as maplibregl from "maplibre-gl";

setWorkerUrl(workerUrl);

export default function EmbassyMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 19,
            attribution:
              '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      center: [13.405, 52.52],
      zoom: 11.2,
    });

    map.on("load", () => {
      map.resize();

      const locatedEmbassies = embassies.filter(
        (embassy: any) => embassy.coordinates,
      );

      locatedEmbassies.forEach((embassy: any) => {
        const el = document.createElement("img");
        el.src = `https://flagcdn.com/w40/${embassy.flagCode}.png`;
        el.alt = `${embassy.country} flag`;
        el.style.width = "32px";
        el.style.height = "auto";
        el.style.cursor = "pointer";
        el.style.borderRadius = "4px";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";

        new maplibregl.Marker({ element: el })
          .setLngLat(embassy.coordinates as [number, number])
          .setPopup(
            new maplibregl.Popup({
              offset: 24,
              className: "embassy-popup",
              maxWidth: "300px",
            }).setHTML(
              `<strong>${embassy.country} ${embassy.type}</strong><br>${embassy.address}<br><small>${embassy.source}</small>`,
            ),
          )
          .addTo(map);
      });

      const points = locatedEmbassies.map(
        (embassy: any) => embassy.coordinates as [number, number],
      );

      if (points.length > 0) {
        const bounds = points.reduce(
          (bounds, point) => bounds.extend(point),
          new maplibregl.LngLatBounds(points[0], points[0]),
        );

        map.fitBounds(bounds, {
          padding: 60,
          maxZoom: 13,
          duration: 0,
        });
      }

      console.log(`Map loaded with ${locatedEmbassies.length} embassies`);
    });

    map.on("error", (event) => {
      console.error("Map loading error:", event.error);
    });

    map.addControl(
      new NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    map.scrollZoom.disable();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive map of embassies in Berlin"
      style={{ height: "600px", width: "100%" }}
      className="overflow-hidden rounded-lg border border-ink/20"
    />
  );
}
