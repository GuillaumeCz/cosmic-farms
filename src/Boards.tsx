import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Farm, Parcel } from "./types";
import { getFarm } from "./data";
import Card from "antd/es/card/Card";
import { Tooltip, GeoJSON } from "react-leaflet";

import { LatLng } from "leaflet";
import { geometryToLatLng, lineToLatLng } from "./utils";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";
import { List } from "antd";

function Boards() {
  const { farmId, parcelId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [parcel, setParcel] = useState<Parcel | null>();
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      if (f) {
        setFarm(f);
        const p: Parcel | undefined = f.parcels.find((p) => p.id === parcelId);
        if (p) {
          setParcel(p);
          const bds = p.boards
            .map((b) => geometryToLatLng(b.coordinates.geometry))
            .reduce((acc, cur) => [...acc, ...cur], []);
          setBounds(bds);
          setViewBounds(bds);
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
                <Card
                  title={b.name}
                  key={`${b.id}-card`}
                  onMouseEnter={() => {
                    // Didn't yet found an easy way to set the zoom value...
                    setViewBounds(geometryToLatLng(b.coordinates.geometry));
                  }}
                  onMouseLeave={() => {
                    setViewBounds(bounds);
                  }}
                >
                  <List
                    size="small"
                    bordered
                    dataSource={b.rows}
                    header={<div>Number of rows: {b.rows.length}</div>}
                    renderItem={(r) => (
                      <List.Item
                        onMouseEnter={() => {
                          setViewBounds(lineToLatLng(r.coordinates.geometry));
                        }}
                        onMouseLeave={() => setViewBounds(bounds)}
                      >
                        {r.name}
                      </List.Item>
                    )}
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
