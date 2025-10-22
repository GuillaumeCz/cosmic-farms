import type { Feature, Point, LineString, Polygon } from "geojson";

export interface Row {
  id: string;
  name: string;
  coordinates: Feature;
}

export interface Board {
  id: string;
  name: string;
  coordinates: Feature;
  rows: Row[];
}

export interface Parcel {
  id: string;
  name: string;
  coordinates: Feature;
  boards: Board[];
}

export interface Farm {
  id: string;
  name: string;
  owner: string;
  coordinates: Feature;
  parcels: Parcel[];
}

export type Geom = Point | Polygon | LineString;
