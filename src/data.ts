import { LatLng } from "leaflet";
import type { Farm } from "./types";

const farm1Coordinates = {
  farm: new LatLng(44.3502628, 3.6953171),
  parcels: [
    [
      [3.6991783005069254, 44.34436913759046],
      [3.699245891763933, 44.34439499279105],
      [3.699568129011257, 44.34406337095041],
      [3.699461240528966, 44.34403077078079],
      [3.6991783005069254, 44.34436913759046],
    ],
    [
      [3.703938204159751, 44.34601735897024],
      [3.70367620966661, 44.34595590469743],
      [3.7035881795562764, 44.34600686680764],
      [3.7032695941935736, 44.34639957322824],
      [3.702364399208767, 44.34728194247148],
      [3.702607530078721, 44.34740035163284],
      [3.703938204159751, 44.34601735897024],
    ],
  ].map((c) => c.map((d) => new LatLng(d[1], d[0]))),
};

const farm0Coordinates = {
  farm: new LatLng(44.3427864, 3.6993908),
  parcels: [
    [
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
    ],
    [
      [3.6969653404329734, 44.348502539866956],
      [3.697115594103868, 44.34853660829819],
      [3.697234697650756, 44.34846191978909],
      [3.6966410122613675, 44.34832040447603],
      [3.6966391799163136, 44.34838985184513],
    ],
  ].map((c) => c.map((d) => new LatLng(d[1], d[0]))),
};

const farm0: Farm = {
  id: `uuid-farm-0`,
  name: `JolisJardins-0`,
  owner: `Joe-0`,
  coordinates: farm0Coordinates.farm,
  parcels: [
    {
      id: `uuid-parcel-0`,
      name: `parcelle du bas-0`,
      coordinates: farm0Coordinates.parcels[0],
      planches: [],
    },
    {
      id: "uuid-parcel-1",
      name: `parcelle 'champ à patates'`,
      coordinates: farm0Coordinates.parcels[1],
      planches: [],
    },
  ],
};

const farm1: Farm = {
  id: `uuid-farm-1`,
  name: `JolisJardins-1`,
  owner: `Joe-1`,
  coordinates: farm1Coordinates.farm,
  parcels: [
    {
      id: `uuid-parcel-0`,
      name: `parcelle du bas-0`,
      coordinates: farm1Coordinates.parcels[0],
      planches: [],
    },
    {
      id: "uuid-parcel-1",
      name: `parcelle 'champ à patates'`,
      coordinates: farm1Coordinates.parcels[1],
      planches: [],
    },
  ],
};

// Vaine émulation d'un call API
export const defaultFarms = [farm0, farm1];

export const getFarm = (id: string): Farm | null => {
  const farm = defaultFarms.find((f) => f.id === id);
  return farm ? farm : null;
};
