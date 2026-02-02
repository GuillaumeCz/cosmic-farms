import {
  type Feature,
  type Point,
  type LineString,
  type Polygon,
  type Geometry,
  type Position,
} from "geojson";
import { LatLng } from "leaflet";
import { GeoJSON } from "./GeoJSON";

import { colorHash } from "./data";

const geojson = new GeoJSON();

export function parseGeoJSONLineString(line: LineString): Feature<LineString> {
  const coordinates: Position[] = line.coordinates;
  const c = geojson.parse(coordinates, {
    GeoJSON: "geometry",
    exclude: ["type", "properties"],
  });
  return c;
}
export function parseGeoJSONPolygon(polygon: Polygon): Feature<Polygon> {
  const coordinates: Position[][] = polygon.coordinates;
  // This case occurs when the data from data.json are loaded via the
  // localStorage.
  if (Array.isArray(coordinates) && coordinates.length == 1) {
    return geojson.parse(coordinates[0], {
      GeoJSON: "geometry",
      exclude: ["type", "properties"],
    });
  }
  // This cas occurs when the data created by a form are loaded via the
  // localStorage.
  return geojson.parse(coordinates, {
    GeoJSON: "geometry",
    exclude: ["type", "properties"],
  });
}
export function parseGeoJSONPoint(point: Point): Feature<Point> {
  const coordinates: Position = point.coordinates;
  const c = geojson.parse(coordinates, {
    GeoJSON: "geometry",
    exclude: ["type", "properties"],
  });
  return c;
}

function parseLatLngToLineString(line: LatLng[]): Feature<LineString> {
  return geojson.parse(
    { line: line.map((l) => [l.lng, l.lat]) },
    {
      LineString: "line",
    },
  );
}

function parseLatLngToPoint(p: LatLng): Feature<Point> {
  return geojson.parse(p, {
    Point: ["lat", "lng"],
  });
}

function parseLatLngToPolygon(polygon: LatLng[]): Feature<Polygon> {
  const d = geojson.parse(
    { polygon: polygon.map((p) => [p.lng, p.lat]) },
    { Polygon: "polygon" },
  ) as Feature<Polygon>;
  // Dirty hack in order to fix the bug related to wrong Feature serialization.
  if (d.geometry.coordinates.length > 1) {
    // @ts-ignore
    d.geometry.coordinates = [d.geometry.coordinates];
  }

  return d;
}

abstract class AbstractElement {
  id: string;
  name: string;
  color: string;
  abstract geojson: Feature<Geometry>;
  abstract toJSON: () => object;

  constructor({ name, id }: { name: string; id?: string }) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.color = colorHash.hex(this.id);
  }
  public toString = (): string => JSON.stringify(this.toJSON());

  public getLatLngs = (): LatLng[] => {
    const { geometry } = this.geojson;
    const { type } = geometry;
    if (type === "Point") {
      const pt: Point = geometry as Point;
      return [new LatLng(pt.coordinates[1], pt.coordinates[0])];
    }
    if (type === "LineString") {
      const l: LineString = geometry as LineString;
      return l.coordinates.map((c: number[]) => new LatLng(c[1], c[0]));
    }
    // type === 'Polygon'
    const po: Polygon = geometry as Polygon;
    let r;
    if (Array.isArray(po.coordinates[0]) && po.coordinates.length === 1) {
      r = po.coordinates[0].map((l: number[]) => new LatLng(l[1], l[0]));
    } else {
      // @ts-ignore
      r = po.coordinates.map((l: number[]) => new LatLng(l[1], l[0]));
    }
    return r;
  };
}

export class Row<F extends Point | LineString> extends AbstractElement {
  geojson: Feature<F>;
  constructor({
    name,
    geojson,
    id,
  }: {
    name: string;
    geojson: Feature<F> | LatLng | LatLng[];
    id?: string;
  }) {
    super({ name, id });
    if (Array.isArray(geojson)) {
      this.geojson = parseLatLngToLineString(geojson) as Feature<F>;
    } else if (geojson instanceof LatLng) {
      this.geojson = parseLatLngToPoint(geojson) as Feature<F>;
    } else {
      this.geojson = geojson;
    }
  }

  toJSON = (): object => {
    return {
      id: this.id,
      name: this.name,
      coordinates: this.geojson,
    };
  };
}

export class Board extends AbstractElement {
  geojson: Feature<Polygon>;
  rows: Row<Point | LineString>[] = [];

  constructor({
    name,
    geojson,
    rows,
    id,
  }: {
    name: string;
    geojson: Feature<Polygon> | LatLng[];
    rows?: Row<Point | LineString>[];
    id?: string;
  }) {
    super({ name, id });
    this.geojson = Array.isArray(geojson)
      ? parseLatLngToPolygon(geojson)
      : geojson;
    this.rows = rows ?? [];
  }

  toJSON = (): object => {
    return {
      id: this.id,
      name: this.name,
      coordinates: [this.geojson],
      rows: this.rows.map((r) => r.toJSON()),
    };
  };
}

export class Parcel extends AbstractElement {
  geojson: Feature<Polygon>;
  boards: Board[] = [];

  constructor({
    name,
    geojson,
    id,
    boards,
  }: {
    name: string;
    geojson: Feature<Polygon> | LatLng[];
    id?: string;
    boards?: Board[];
  }) {
    super({ name, id });
    this.geojson = Array.isArray(geojson)
      ? parseLatLngToPolygon(geojson)
      : geojson;
    this.boards = boards ?? [];
  }

  toJSON = (): object => {
    return {
      id: this.id,
      name: this.name,
      coordinates: this.geojson,
      boards: this.boards.map((b) => b.toJSON()),
    };
  };
}

export class Farm extends AbstractElement {
  owner: string;
  geojson: Feature<Point>;
  parcels: Parcel[] = [];

  constructor({
    owner,
    name,
    geojson,
    id,
    parcels,
  }: {
    owner: string;
    name: string;
    geojson: Feature<Point> | LatLng;
    id?: string;
    parcels?: Parcel[];
  }) {
    super({ name, id });
    this.owner = owner;
    this.geojson =
      geojson instanceof LatLng ? parseLatLngToPoint(geojson) : geojson;
    this.parcels = parcels ?? [];
  }

  setGeojsonAsLatLng = (pos: LatLng) => {
    this.geojson = parseLatLngToPoint(pos);
  };

  toJSON = (): object => {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      coordinates: this.geojson,
      parcels: this.parcels.map((p) => p.toJSON()),
    };
  };
}
