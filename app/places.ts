export type Place = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  years: number[];
  note?: string;
};

// To jest jedyne miejsce, w którym przechowywana jest publiczna lista podróży.
// Dopisz kolejny obiekt, aby nowe miejsce pojawiło się na mapie dla wszystkich.
export const places: Place[] = [
  {
    id: "zakopane",
    name: "Zakopane",
    region: "Małopolskie",
    lat: 49.2992,
    lng: 19.9496,
    years: [2010, 2025, 2026],
  },
  {
    id: "krakow",
    name: "Kraków",
    region: "Małopolskie",
    lat: 50.061667,
    lng: 19.9375,
    years: [2010, 2025],
  },
  {
    id: "oswiecim",
    name: "Oświęcim",
    region: "Małopolskie",
    lat: 50.038056,
    lng: 19.220833,
    years: [2010],
  },
  {
    id: "belchatow",
    name: "Elektrownia Bełchatów",
    region: "Łódzkie",
    lat: 51.2675,
    lng: 19.325833,
    years: [2013],
  },
  {
    id: "turow",
    name: "Elektrownia Turów",
    region: "Dolnośląskie",
    lat: 50.94725,
    lng: 14.912056,
    years: [2013],
  },
  {
    id: "dychow",
    name: "EW Dychów",
    region: "Lubuskie",
    lat: 51.986389,
    lng: 15.061667,
    years: [2013],
  },
  {
    id: "frydlant",
    name: "Frýdlant",
    region: "Liberecký kraj",
    lat: 50.921111,
    lng: 15.080278,
    years: [2013],
  },
  {
    id: "berlin",
    name: "Berlin",
    region: "Berlin",
    lat: 52.518611,
    lng: 13.391667,
    years: [2005],
  },
  {
    id: "soltau",
    name: "Soltau",
    region: "Niedersachsen",
    lat: 53.02532,
    lng: 9.87774,
    years: [2005],
  },
  {
    id: "bruksela",
    name: "Bruksela",
    region: "Région de Bruxelles-Capitale",
    lat: 50.833333,
    lng: 4.35,
    years: [2005],
  },
];
