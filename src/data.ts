import { LatLng } from "leaflet";
import type { Farm, Parcel } from "./types";

const generateParcels = (nbr: number): Parcel[] => {
  let parcels: Parcel[] = [];
  for (let i = 0; i < nbr; i++) {
    parcels.push({
      id: `uuid-parcel-${i}`,
      name: `parcel du bas-${i}`,
      coordinates: [new LatLng(49.505, -2.09), new LatLng(53.505, 2.09)],
      planches: [],
    });
  }
  return parcels;
};

const anotherParcelCoordinates = [
  [3.6969653404329734, 44.348502539866956],
  [3.697115594103868, 44.34853660829819],
  [3.697234697650756, 44.34846191978909],
  [3.6966410122613675, 44.34832040447603],
  [3.6966391799163136, 44.34838985184513],
].map((v) => new LatLng(v[1], v[0]));

const parcelCoordinates = [
  [3.6980724189589456, 44.349178942381],
  [3.6983229630409302, 44.34918768199748],
  [3.698313796739796, 44.348940787195176],
  [3.698246577676322, 44.348752884220715],
  [3.6981151947918156, 44.348591199841024],
  [3.697901315770915, 44.348457919082506],
  [3.697415504823321, 44.348276569470386],
  [3.6972780111670267, 44.34847758349173],
  [3.697611051385407, 44.34859338474797],
  [3.6978188194910677, 44.34866985715698],
  [3.6979563131473614, 44.34876599377873],
  [3.6980357538978628, 44.34889708888991],
  [3.6980479757283424, 44.34896263633556],
  [3.698051031114237, 44.349019444042],
  [3.698063252657812, 44.3491439838763],
  [3.6980724189589456, 44.349178942381],
].map((v) => new LatLng(v[1], v[0]));

const farmCoordinates = [
  new LatLng(44.3427864, 3.6993908),
  new LatLng(44.3502628, 3.6953171),
];

const farm0: Farm = {
  id: `uuid-farm-0`,
  name: `JolisJardins-0`,
  owner: `Joe-0`,
  coordinates: farmCoordinates[0],
  parcels: [
    {
      id: `uuid-parcel-0`,
      name: `parcelle du bas-0`,
      coordinates: parcelCoordinates,
      planches: [],
    },
    {
      id: "uuid-parcel-1",
      name: `parcelle 'champ à patates'`,
      coordinates: anotherParcelCoordinates,
      planches: [],
    },
  ],
};

// Vaine émulation d'un call API
const farms = [farm0];

export const getFarms = farms;

export const getFarm = (id: string): Farm | null => {
  const farm = farms.find((f) => f.id === id);
  return farm ? farm : null;
};

export const generateFarms = (nbr: number): Farm[] => {
  let farms: Farm[] = [farm0];
  for (let i = 1; i <= nbr; i++) {
    farms.push({
      id: `uuid-farm-${i}`,
      name: `JolisJardins-${i}`,
      owner: `Joe-${i}`,
      coordinates: farmCoordinates[i % nbr],
      parcels: generateParcels(Math.floor(Math.random() * 3)),
    });
  }
  return farms;
};
