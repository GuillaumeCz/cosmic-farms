import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type JSX,
} from "react";
import type { Farm } from "./types";

export type CurrentFarmContextType = {
  currentFarm: Farm | null;
  setCurrentFarm: Dispatch<Farm | null>;
};

export const CurrentFarmContext = createContext<CurrentFarmContextType | null>(
  null,
);

const Providers = ({ children }: { children: JSX.Element }) => {
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);

  return (
    <CurrentFarmContext value={{ currentFarm, setCurrentFarm }}>
      {children}
    </CurrentFarmContext>
  );
};

export default Providers;
