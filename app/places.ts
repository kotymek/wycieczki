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
];
