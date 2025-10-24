import { type JSX, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Farm, Parcel } from "./types";
import { getFarm } from "./data";
import Card from "antd/es/card/Card";
import { Tooltip, GeoJSON } from "react-leaflet";

import { LatLng } from "leaflet";
import { geometryToLatLng } from "./utils";
import { CurrentFarmContext, type CurrentFarmContextType } from "./Providers";
import { List } from "antd";

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
                <div key={b.id + "-boards"}>
                  <GeoJSON
                    pathOptions={{ color: "red" }}
                    data={b.coordinates}
                    key={b.id}
                  >
                    <Tooltip>{b.name}</Tooltip>
                  </GeoJSON>
                  {b.rows.length > 0 &&
                    b.rows.map((r) => (
                      <GeoJSON data={r.coordinates} key={r.id}>
                        <Tooltip>{r.name}</Tooltip>
                      </GeoJSON>
                    ))}
                </div>
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
                  <List
                    size="small"
                    bordered
                    dataSource={b.rows}
                    header={<div>Number of rows: {b.rows.length}</div>}
                    renderItem={(r) => <List.Item>{r.name}</List.Item>}
                  />
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
