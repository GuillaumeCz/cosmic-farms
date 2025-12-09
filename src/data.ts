import type { Farm } from "./types";
import ColorHash from "color-hash";

import data from "./data.json";
import type { Feature } from "geojson";

const colorHash = new ColorHash();

const addVirtuals = (a: any): any => ({
  ...a,
  color: colorHash.hex(a.id),
  coordinates: a.coordinates as Feature,
});

const farms: Farm[] = data.farms.map((f) => ({
  ...addVirtuals(f),
  parcels: f.parcels.map((p) => ({
    ...addVirtuals(p),
    boards: p.boards.map((b) => ({
      ...addVirtuals(b),
      rows: b.rows.map((r) => ({ ...addVirtuals(r) })),
    })),
  })),
}));

export const getFarms = (): Farm[] => farms;

export const getFarm = (farmId: string): Farm | null => {
  return farms.find(({ id }) => farmId === id) ?? null;
};
