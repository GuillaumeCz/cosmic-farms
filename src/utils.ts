import type { Feature } from "geojson";
import { LatLng } from "leaflet";
import GeoJSON from "geojson";

// Using `any` type should never occurs...
// - This was made because for some reason, TypeScript doesn't consider
//   shape.coordinates as a Geometry instance...
export const geoJsonToLatLng = (shape: any): LatLng => {
  const { coordinates } = shape;
  const [lng, lat]: number[] = coordinates;
  return new LatLng(lat, lng);
};

export const geometryToLatLng = (shape: any): LatLng[] => {
  const { coordinates } = shape;
  if (coordinates.every((c: any) => Array.isArray(c))) {
    return coordinates[0].map((c: number[]) => new LatLng(c[1], c[0]));
  }
  return [coordinates];
};

export const lineToLatLng = (line: any): LatLng[] => {
  const { coordinates } = line;
  return coordinates.map((c: number[]) => new LatLng(c[1], c[0]));
};

export const pointToLatLng = (point: any): LatLng[] => {
  const { coordinates } = point;
  return [new LatLng(coordinates[1], coordinates[0])];
};

export const latLngToFeaturePoint = (point: LatLng): Feature => {
  return GeoJSON.parse(point, { Point: ["lat", "lng"] });
};

export const LatLngsToFeaturePolygon = (polygon: LatLng[]): Feature => {
  return GeoJSON.parse(
    { polygon: [polygon.map((p) => [p.lng, p.lat])] },
    { Polygon: "polygon" },
  );
};

export const LatLngsToFeatureLine = (p1: LatLng, p2: LatLng): Feature => {
  return GeoJSON.parse(
    [{ line: [p1.lng, p1.lat] }, { line: [p2.lng, p2.lat] }],
    { LineString: "line" },
  );
};
