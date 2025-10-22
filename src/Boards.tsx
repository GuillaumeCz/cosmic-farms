import { type JSX, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Farm, Parcel } from "./types";
import { getFarm } from "./data";
import Card from "antd/es/card/Card";
import { Tooltip, GeoJSON } from "react-leaflet";

import { LatLng } from "leaflet";
import { geometryToLatLng } from "./utils";
import { CurrentFarmContext, type CurrentFarmContextType } from "./Providers";

function Boards({
  setViewBounds,
  setMapChildren,
}: {
  setViewBounds: (v: LatLng[]) => void;
  setMapChildren: (v: JSX.Element) => void;
}) {
  const { farmId, parcelId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [parcel, setParcel] = useState<Parcel | null>();
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      if (f) {
        setFarm(f);
        const p: Parcel | undefined = f.parcels.find((p) => p.id === parcelId);
        if (p) {
          setParcel(p);
          const bounds = p.boards
            .map((b) => geometryToLatLng(b.coordinates.geometry))
            .reduce((acc, cur) => [...acc, ...cur], []);
          setViewBounds(bounds);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (farm) {
      setCurrentFarm(farm);
    }
  }, [farm]);

  useEffect(() => {
    setMapChildren(
      <>
        {farm && (
          <GeoJSON data={farm.coordinates} key={`${farm.id}-map`}>
            <Tooltip>{farm.name}</Tooltip>
          </GeoJSON>
        )}
        {parcel && (
          <>
            <GeoJSON data={parcel.coordinates}>
              <Tooltip>{parcel.name}</Tooltip>
            </GeoJSON>
            {parcel.boards.length > 0 &&
              parcel.boards.map((b) => (
                <GeoJSON
                  pathOptions={{ color: "red" }}
                  data={b.coordinates}
                  key={b.id}
                >
                  <Tooltip>{b.name}</Tooltip>
                </GeoJSON>
              ))}
          </>
        )}
      </>,
    );
  }, [parcel, farm]);

  return (
    <>
      {farm && (
        <>
          {parcel && (
            <>
              {parcel.boards.map((b) => (
                <Card title={b.name} key={`${b.id}-card`}>
                  <p>Number of rows {b.rows.length}</p>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Boards;
