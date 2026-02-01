import type { LineString, Point } from "geojson";
import { type LatLng } from "leaflet";
import ColorHash from "color-hash";

import {
  Parcel,
  Board,
  Row,
  Farm,
  parseGeoJSONPolygon,
  parseGeoJSONPoint,
  parseGeoJSONLineString,
} from "./models";

import data from "./data.json";

export const colorHash = new ColorHash();

const classInit = (storedData: string | null) => {
  let fs: Farm[];

  let c;
  if (storedData && storedData.length > 0) {
    try {
      c = JSON.parse(storedData).map((s: any) => JSON.parse(s));
    } catch (err) {
      c = JSON.parse(storedData);
    }
  } else {
    // @ts-ignore
    c = data.farms;
  }

  fs = c.map(
    (f: any) =>
      new Farm({
        owner: f.owner,
        name: f.name,
        id: f.id,
        geojson: parseGeoJSONPoint(f),
        parcels: f.parcels.map(
          (p: any) =>
            new Parcel({
              name: p.name,
              id: p.id,
              geojson: parseGeoJSONPolygon(p),
              boards: p.boards.map(
                (b: any) =>
                  new Board({
                    name: b.name,
                    id: b.id,
                    geojson: parseGeoJSONPolygon(b),
                    rows: b.rows.map((r: any) => {
                      if (r.coordinates.geometry.type === "Point") {
                        return new Row<Point>({
                          name: r.name,
                          id: r.id,
                          geojson: parseGeoJSONPoint(r),
                        });
                      }
                      return new Row<LineString>({
                        name: r.name,
                        id: r.id,
                        geojson: parseGeoJSONLineString(r),
                      });
                    }),
                  }),
              ),
            }),
        ),
      }),
  );

  // console.log("start");
  // console.log(fs[0].getLatLngs());
  // console.log(fs[0].parcels[0].getLatLngs());
  // console.log(fs[0].parcels[0].boards[0].getLatLngs());
  // console.log(fs[0].parcels[0].boards[0].rows[0].getLatLngs());
  // console.log(fs[0].parcels[0].boards[0].rows[2].getLatLngs());
  return fs;
};

const storedData: string | null = localStorage.getItem("farms");

let fs: Farm[] = classInit(storedData);

export const getFarms = (): Farm[] => fs;

export const getFarm = (farmId: string): Farm | null => {
  return fs.find(({ id }) => farmId === id) ?? null;
};

export const createFarm = (newFarm: {
  owner: string;
  name: string;
  position: LatLng;
}): Farm[] => {
  const f = new Farm({
    name: newFarm.name,
    owner: newFarm.owner,
    geojson: newFarm.position,
  });

  fs = [...fs, f];

  const json = fs.map((f) => f.toString());

  localStorage.setItem("farms", JSON.stringify(json));

  return fs;
};

export const createParcel = (
  farmId: string,
  newParcel: { name: string; position: LatLng[] },
): Parcel => {
  const p = new Parcel({ name: newParcel.name, geojson: newParcel.position });
  const fIndex = fs.findIndex((v) => v.id === farmId);

  if (fIndex !== -1) {
    fs[fIndex].parcels = [...fs[fIndex].parcels, p];
    const json = fs.map((f) => f.toString());
    localStorage.setItem("farms", JSON.stringify(json));
  } else {
    console.error("farmId unknown");
  }
  return p;
};
