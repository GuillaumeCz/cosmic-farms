import type { Farm, Parcel } from "./types";
import ColorHash from "color-hash";

import data from "./data.json";
import { type LatLng } from "leaflet";
import GeoJSON from "geojson";
import { LatLngsToFeaturePolygon, latLngToFeaturePoint } from "./utils";

const colorHash = new ColorHash();

const addVirtuals = (a: any): any => {
  return {
    ...a,
    color: colorHash.hex(a.id),
    coordinates: a.coordinates as GeoJSON.Feature,
  };
};

let farms: Farm[] = data.farms.map((f) => ({
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

export const createFarm = (newFarm: {
  owner: string;
  name: string;
  position: LatLng;
}): Farm[] => {
  const feat: GeoJSON.Feature = latLngToFeaturePoint(newFarm.position);
  const id = crypto.randomUUID();
  const f: Farm = {
    id,
    owner: newFarm.owner,
    name: newFarm.name,
    color: colorHash.hex(id),
    coordinates: feat,
    parcels: [],
  };

  farms = [...farms, f];

  return farms;
};

export const createParcel = (
  farmId: string,
  newParcel: { name: string; position: LatLng[] },
): Parcel => {
  const feat: GeoJSON.Feature = LatLngsToFeaturePolygon(newParcel.position);
  const id = crypto.randomUUID();
  const p: Parcel = {
    id,
    name: newParcel.name,
    coordinates: feat,
    color: colorHash.hex(id),
    boards: [],
  };

  const fIndex = farms.findIndex((v) => v.id === farmId);

  if (fIndex !== -1) {
    farms[fIndex].parcels = [...farms[fIndex].parcels, p];
  } else {
    console.error("farmId unknown");
  }
  return p;
};
