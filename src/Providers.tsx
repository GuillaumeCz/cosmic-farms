import { createContext, useState, type Dispatch, type JSX } from "react";
import type { Farm } from "./types";
import type { LatLng } from "leaflet";

export type CurrentFarmContextType = {
  currentFarm: Farm | null;
  setCurrentFarm: Dispatch<Farm | null>;
};

export type MapContextType = {
  viewBounds: LatLng[];
  setViewBounds: Dispatch<LatLng[]>;
  mapChildren: JSX.Element;
  setMapChildren: Dispatch<JSX.Element>;
};

export const CurrentFarmContext = createContext<CurrentFarmContextType | null>(
  null,
);

export const MapContext = createContext<MapContextType | null>(null);

const Providers = ({ children }: { children: JSX.Element }) => {
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);
  const [viewBounds, setViewBounds] = useState<LatLng[]>([]);
  const [mapChildren, setMapChildren] = useState<JSX.Element>(<></>);

  return (
    <CurrentFarmContext value={{ currentFarm, setCurrentFarm }}>
      <MapContext
        value={{
          viewBounds,
          setViewBounds,
          mapChildren,
          setMapChildren,
        }}
      >
        {children}
      </MapContext>
    </CurrentFarmContext>
  );
};

export default Providers;
