import type { Farm } from "./types";

import d from "./data.json";
import type { Feature } from "geojson";

interface Farms {
  farms: Farm[];
}

const data: Farms = {
  farms: d.farms.map((f) => ({
    ...f,
    coordinates: f.coordinates as Feature,
    parcels: f.parcels.map((p) => ({
      ...p,
      coordinates: p.coordinates as Feature,
      boards: p.boards.map((b) => ({
        ...b,
        coordinates: b.coordinates as Feature,
        rows: b.rows.map((r) => ({
          ...r,
          coordinates: r.coordinates as Feature,
        })),
      })),
    })),
  })),
};

data.farms[0].coordinates.geometry;

export const getFarms = (): Farm[] => data.farms;

export const getFarm = (id: string): Farm | null => {
  const farm = data.farms.find((f) => f.id === id);
  return farm ? farm : null;
};
