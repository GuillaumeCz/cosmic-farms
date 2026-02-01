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

  return fs;
};

const storedData: string | null = localStorage.getItem("farms");

let fs: Farm[] = classInit(storedData);

export const getFarms = (): Farm[] => fs;

export const getFarm = (farmId: string): Farm | null => {
  return fs.find(({ id }) => farmId === id) ?? null;
};

export const getParcel = (farmId: string, parcelId: string): Parcel | null => {
  return (
    fs
      .find(({ id }) => farmId === id)
      ?.parcels.find(({ id }) => id === parcelId) ?? null
  );
};

export const getBoard = (
  farmId: string,
  parcelId: string,
  boardId: string,
): Board | null => {
  return (
    fs
      .find(({ id }) => farmId === id)
      ?.parcels.find(({ id }) => id === parcelId)
      ?.boards.find(({ id }) => id === boardId) ?? null
  );
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

export const createBoard = (
  farmId: string,
  parcelId: string,
  newBoard: { name: string; position: LatLng[] },
): Board => {
  const b = new Board({ name: newBoard.name, geojson: newBoard.position });
  const fIndex = fs.findIndex(({ id }) => id === farmId);
  const pIndex = fs[fIndex].parcels.findIndex(({ id }) => id === parcelId);
  if (fIndex !== -1 && pIndex !== -1) {
    fs[fIndex].parcels[pIndex].boards = [
      ...fs[fIndex].parcels[pIndex].boards,
      b,
    ];
    const json = fs.map((f) => f.toString());
    localStorage.setItem("farms", JSON.stringify(json));
  } else {
    console.error("farmId or parcelId unknown", { farmId, parcelId });
  }
  return b;
};

export const createRow = (
  farmId: string,
  parcelId: string,
  boardId: string,
  newRow: { name: string; position: LatLng[] },
): Row<LineString | Point> => {
  const r =
    newRow.position.length === 1
      ? new Row<Point>({ name: newRow.name, geojson: newRow.position[0] })
      : new Row<LineString>({ name: newRow.name, geojson: newRow.position });

  const fIndex = fs.findIndex(({ id }) => id === farmId);
  const pIndex = fs[fIndex].parcels.findIndex(({ id }) => id === parcelId);
  const bIndex = fs[fIndex].parcels[pIndex].boards.findIndex(
    ({ id }) => id === boardId,
  );

  if (fIndex !== -1 && pIndex !== -1 && bIndex !== -1) {
    fs[fIndex].parcels[pIndex].boards[bIndex].rows = [
      ...fs[fIndex].parcels[pIndex].boards[bIndex].rows,
      r,
    ];
    const json = fs.map((f) => f.toString());
    localStorage.setItem("farms", JSON.stringify(json));
  } else {
    console.error("farmId or parcelId or boardId unknown", {
      farmId,
      parcelId,
      boardId,
    });
  }
  return r;
};
