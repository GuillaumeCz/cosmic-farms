import type { Feature, Point, LineString, Polygon } from "geojson";

export interface GeoElement {
  id: string;
  name: string;
  coordinates: Feature;
  color?: string;
}

export interface Row extends GeoElement {}

export interface Board extends GeoElement {
  rows: Row[];
}

export interface Parcel extends GeoElement {
  boards: Board[];
}

export interface Farm extends GeoElement {
  owner: string;
  parcels: Parcel[];
}

export type Geom = Point | Polygon | LineString;
