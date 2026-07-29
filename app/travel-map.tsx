"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { places } from "./places";

const colors = ["#dc5a37", "#e7a33d", "#2f7e72", "#5f6e95"];

function MapView({ mode }: { mode: "polska" | "europa" }) {
  const map = useMap();
  useEffect(() => {
    if (mode === "polska") {
      map.flyTo([52.05, 19.15], 6, { duration: 0.9 });
    } else {
      map.flyTo([51.2, 14.5], 4, { duration: 0.9 });
    }
  }, [map, mode]);
  return null;
}

export default function TravelMap() {
  const [selectedId, setSelectedId] = useState("zakopane");
  const [view, setView] = useState<"polska" | "europa">("polska");
  const [year, setYear] = useState<number | "all">("all");

  const allYears = useMemo(
    () =>
      Array.from(new Set(places.flatMap((place) => place.years))).sort(
        (a, b) => b - a,
      ),
    [],
  );
  const visiblePlaces = useMemo(
    () =>
      year === "all"
        ? places
        : places.filter((place) => place.years.includes(year)),
    [year],
  );
  const selected = places.find((place) => place.id === selectedId);
  const visitCount = places.reduce((sum, place) => sum + place.years.length, 0);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ŚLADY</span>
          <span className="brand-subtitle">moja mapa podróży</span>
        </div>
        <div className="topbar-actions">
          <span className="public-badge">Mapa publiczna · tylko podgląd</span>
          <div className="view-switch" aria-label="Zasięg mapy">
            <button
              className={view === "polska" ? "active" : ""}
              onClick={() => setView("polska")}
            >
              Polska
            </button>
            <button
              className={view === "europa" ? "active" : ""}
              onClick={() => setView("europa")}
            >
              Europa
            </button>
          </div>
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <p className="eyebrow">Publiczny atlas wspomnień</p>
            <h1>Miejsca, do których prowadzą historie.</h1>
            <p className="readonly-note">
              Mapa jest udostępniona do oglądania. Jej zawartość aktualizuje
              wyłącznie właściciel.
            </p>
            <div className="stats">
              <div>
                <strong>{places.length}</strong>
                <span>miejsca</span>
              </div>
              <div>
                <strong>{visitCount}</strong>
                <span>wizyty</span>
              </div>
              <div>
                <strong>{allYears.length}</strong>
                <span>lat</span>
              </div>
            </div>
          </div>

          <div className="filter-row">
            <label htmlFor="year">Pokaż rok</label>
            <select
              id="year"
              value={year}
              onChange={(event) =>
                setYear(
                  event.target.value === "all"
                    ? "all"
                    : Number(event.target.value),
                )
              }
            >
              <option value="all">Wszystkie lata</option>
              {allYears.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="place-list">
            {visiblePlaces.map((place, index) => (
              <button
                key={place.id}
                className={`place-card ${selectedId === place.id ? "selected" : ""}`}
                onClick={() => setSelectedId(place.id)}
              >
                <span
                  className="place-index"
                  style={{ background: colors[index % colors.length] }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="place-copy">
                  <strong>{place.name}</strong>
                  <small>{place.region}</small>
                  <span className="year-chips">
                    {place.years.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </span>
                </span>
                <span className="arrow">↗</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="map-wrap">
          <MapContainer
            center={[52.05, 19.15] as LatLngExpression}
            zoom={6}
            minZoom={3}
            maxZoom={18}
            zoomControl
            className="map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapView mode={view} />
            {visiblePlaces.map((place, index) => (
              <CircleMarker
                key={place.id}
                center={[place.lat, place.lng]}
                radius={selectedId === place.id ? 13 : 9}
                pathOptions={{
                  color: "#fff9ef",
                  weight: selectedId === place.id ? 4 : 3,
                  fillColor: colors[index % colors.length],
                  fillOpacity: 1,
                }}
                eventHandlers={{ click: () => setSelectedId(place.id) }}
              >
                <Tooltip direction="top" offset={[0, -8]}>
                  {place.name}
                </Tooltip>
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.years.join(" · ")}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {selected && (
            <article className="memory-card">
              <button
                className="close"
                onClick={() => setSelectedId("")}
                aria-label="Zamknij szczegóły"
              >
                ×
              </button>
              <p className="eyebrow">{selected.region}</p>
              <h2>{selected.name}</h2>
              <div className="memory-years">
                {selected.years.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {selected.note && <p className="memory-note">{selected.note}</p>}
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
