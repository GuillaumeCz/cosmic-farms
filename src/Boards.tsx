import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Farm, Parcel } from "./types";
import { getFarm } from "./data";
import Card from "antd/es/card/Card";
import { Tooltip, GeoJSON } from "react-leaflet";
import ColorHash from "color-hash";
import { List } from "antd";

import { LatLng } from "leaflet";
import { geometryToLatLng, lineToLatLng } from "./utils";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";

import "./shared.css";

function Boards() {
  const { farmId, parcelId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [parcel, setParcel] = useState<Parcel | null>();
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const [eltsIdToColor, setEltsIdToColor] = useState<{ [key: string]: string }>(
    {},
  );
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
        const p: Parcel | undefined = f.parcels.find(
          ({ id }) => id === parcelId,
        );
        if (p) {
          const bds = p.boards
            .map(({ coordinates: { geometry } }) => geometryToLatLng(geometry))
            .reduce((acc, cur) => [...acc, ...cur], []);
          const idToColor: { [key: string]: string } = {};
          const ch = new ColorHash();
          p.boards.forEach(({ id, rows }) => {
            idToColor[id] = ch.hex(id);
            if (rows.length > 0) {
              rows.forEach((r) => {
                idToColor[r.id] = ch.hex(r.id);
              });
            }
          });
          setEltsIdToColor(idToColor);
          setParcel(p);
          setBounds(bds);
          setViewBounds(bds);
        }
      }
      setFarm(f);
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
            <GeoJSON
              data={parcel.coordinates}
              pathOptions={{ fillOpacity: 0, color: "grey" }}
            >
              <Tooltip>{parcel.name}</Tooltip>
            </GeoJSON>
            {parcel.boards.length > 0 &&
              parcel.boards.map(({ id, coordinates, name, rows }) => (
                <div key={id + "-boards"}>
                  <GeoJSON
                    pathOptions={{ color: eltsIdToColor[id] }}
                    data={coordinates}
                    key={id}
                  >
                    <Tooltip>{name}</Tooltip>
                  </GeoJSON>
                  {rows.length > 0 &&
                    rows.map((r) => (
                      <GeoJSON
                        data={r.coordinates}
                        key={r.id}
                        pathOptions={{ color: eltsIdToColor[r.id] }}
                      >
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
              {parcel.boards.map(
                ({ id, name, rows, coordinates: { geometry } }) => (
                  <Card
                    extra={
                      <div
                        className="color"
                        style={{
                          background: eltsIdToColor[id],
                          width: "22px",
                          height: "22px",
                          borderRadius: "15px",
                        }}
                      ></div>
                    }
                    title={name}
                    key={`${id}-card`}
                    onMouseEnter={() => {
                      // Didn't yet found an easy way to set the zoom value...
                      setViewBounds(geometryToLatLng(geometry));
                    }}
                    onMouseLeave={() => {
                      setViewBounds(bounds);
                    }}
                  >
                    <List
                      size="small"
                      bordered
                      dataSource={rows}
                      header={<div>Number of rows: {rows.length}</div>}
                      renderItem={(r) => (
                        <List.Item
                          onMouseEnter={() => {
                            setViewBounds(lineToLatLng(r.coordinates.geometry));
                          }}
                          onMouseLeave={() => setViewBounds(bounds)}
                        >
                          <>
                            {r.name}
                            <div
                              className="color"
                              style={{
                                background: eltsIdToColor[r.id],
                              }}
                            ></div>
                          </>
                        </List.Item>
                      )}
                    />
                  </Card>
                ),
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Boards;
