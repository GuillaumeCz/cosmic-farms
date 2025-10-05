import { LatLng } from "leaflet";

export interface Row {
  id: string;
  name: string;
  coordinates: LatLng[];
}

export interface Board {
  id: string;
  name: string;
  coordinates: LatLng[];
  rows: Row[];
}

export interface Parcel {
  id: string;
  name: string;
  coordinates: LatLng[];
  boards: Board[];
}

export interface Farm {
  id: string;
  name: string;
  owner: string;
  coordinates: LatLng;
  parcels: Parcel[];
}
