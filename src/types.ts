import { LatLng } from "leaflet";

export interface Rang {
  id: string;
  name: string;
}

export interface Planche {
  id: string;
  name: string;
  rangs: Rang[];
}

export interface Parcel {
  id: string;
  name: string;
  coordinates: LatLng[];
  planches: Planche[];
}

export interface Farm {
  id: string;
  name: string;
  owner: string;
  coordinates: LatLng;
  parcels: Parcel[];
}
