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
];
