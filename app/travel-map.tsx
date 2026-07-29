"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type Place = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  years: number[];
  note?: string;
};

const STORAGE_KEY = "slady-miejsca-v1";
const seedPlaces: Place[] = [
  {
    id: "zakopane",
    name: "Zakopane",
    region: "Małopolskie",
    lat: 49.2992,
    lng: 19.9496,
    years: [2024, 2026],
    note: "Tatry, spacery i powroty.",
  },
  {
    id: "lipka",
    name: "Gmina Lipka",
    region: "Wielkopolskie",
    lat: 53.4967,
    lng: 17.2506,
    years: [2015],
  },
];

const colors = ["#dc5a37", "#e7a33d", "#2f7e72", "#5f6e95"];

function MapClick({
  active,
  onPick,
}: {
  active: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      if (active) onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

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

function yearsFromText(text: string) {
  return Array.from(
    new Set(
      text
        .split(/[,\s]+/)
        .map((value) => Number(value))
        .filter((year) => year >= 1900 && year <= 2100),
    ),
  ).sort();
}

export default function TravelMap() {
  const [places, setPlaces] = useState<Place[]>(seedPlaces);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState("zakopane");
  const [view, setView] = useState<"polska" | "europa">("polska");
  const [year, setYear] = useState<number | "all">("all");
  const [adding, setAdding] = useState(false);
  const [draftCoords, setDraftCoords] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [years, setYears] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPlaces(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }, [places, ready]);

  const allYears = useMemo(
    () =>
      Array.from(new Set(places.flatMap((place) => place.years))).sort(
        (a, b) => b - a,
      ),
    [places],
  );
  const visiblePlaces = useMemo(
    () =>
      year === "all"
        ? places
        : places.filter((place) => place.years.includes(year)),
    [places, year],
  );
  const selected = places.find((place) => place.id === selectedId);
  const visitCount = places.reduce((sum, place) => sum + place.years.length, 0);

  const startAdding = () => {
    setAdding(true);
    setDraftCoords(null);
    setSelectedId("");
  };

  const cancelAdding = () => {
    setAdding(false);
    setDraftCoords(null);
    setName("");
    setRegion("");
    setYears("");
    setNote("");
  };

  const savePlace = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedYears = yearsFromText(years);
    if (!draftCoords || !name.trim() || parsedYears.length === 0) return;
    const place: Place = {
      id: `${Date.now()}`,
      name: name.trim(),
      region: region.trim() || "Moje miejsce",
      lat: draftCoords[0],
      lng: draftCoords[1],
      years: parsedYears,
      note: note.trim(),
    };
    setPlaces((current) => [...current, place]);
    setSelectedId(place.id);
    cancelAdding();
  };

  const deleteSelected = () => {
    if (!selected) return;
    setPlaces((current) => current.filter((place) => place.id !== selected.id));
    setSelectedId("");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ŚLADY</span>
          <span className="brand-subtitle">moja mapa podróży</span>
        </div>
        <div className="topbar-actions">
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
          <button className="add-button" onClick={startAdding}>
            <span>＋</span> Dodaj miejsce
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <p className="eyebrow">Twój atlas wspomnień</p>
            <h1>Miejsca, do których prowadzą historie.</h1>
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
                onClick={() => {
                  setSelectedId(place.id);
                  setAdding(false);
                }}
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

        <section className={`map-wrap ${adding ? "is-adding" : ""}`}>
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
            <MapClick
              active={adding}
              onPick={(lat, lng) => setDraftCoords([lat, lng])}
            />
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
                eventHandlers={{
                  click: () => {
                    setSelectedId(place.id);
                    setAdding(false);
                  },
                }}
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
            {draftCoords && (
              <CircleMarker
                center={draftCoords}
                radius={12}
                pathOptions={{
                  color: "#ffffff",
                  weight: 4,
                  fillColor: "#dc5a37",
                  fillOpacity: 1,
                }}
              />
            )}
          </MapContainer>

          {adding && !draftCoords && (
            <div className="map-hint">
              <span>1</span>
              Kliknij na mapie miejsce, które chcesz zapisać
              <button onClick={cancelAdding}>Anuluj</button>
            </div>
          )}

          {adding && draftCoords && (
            <form className="editor-card" onSubmit={savePlace}>
              <div className="editor-heading">
                <div>
                  <p className="eyebrow">Nowy punkt</p>
                  <h2>Opowiedz, gdzie byłeś</h2>
                </div>
                <button type="button" className="close" onClick={cancelAdding}>
                  ×
                </button>
              </div>
              <label>
                Nazwa miejsca
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="np. Karpacz"
                  required
                />
              </label>
              <label>
                Region lub kraj
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder="np. Dolnośląskie"
                />
              </label>
              <label>
                Lata odwiedzin
                <input
                  value={years}
                  onChange={(event) => setYears(event.target.value)}
                  placeholder="np. 2019, 2023, 2026"
                  required
                />
              </label>
              <label>
                Krótka notatka <span>(opcjonalnie)</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Co chcesz zapamiętać?"
                />
              </label>
              <button className="save-button" type="submit">
                Zapisz na mapie
              </button>
            </form>
          )}

          {!adding && selected && (
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
              <button className="delete-button" onClick={deleteSelected}>
                Usuń miejsce
              </button>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
