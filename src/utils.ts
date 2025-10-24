import { LatLng } from "leaflet";

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
  return coordinates[0].map((c: number[]) => new LatLng(c[1], c[0]));
};

export const lineToLatLng = (line: any): LatLng[] => {
  const { coordinates } = line;
  return coordinates.map((c: number[]) => new LatLng(c[1], c[0]));
};
