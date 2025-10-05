import { LatLng } from "leaflet";

export interface Rang {
  id: string;
  name: string;
}

export interface Board {
  id: string;
  name: string;
  rangs: Rang[];
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
