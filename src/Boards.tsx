import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCFarm } from "./data";
import Card from "antd/es/card/Card";
import { List } from "antd";
import { CFarm, CParcel } from "./models";

import { LatLng } from "leaflet";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";

import "./shared.css";
import ParcelElts from "./map/ParcelElts";
import FarmElts from "./map/FarmElts";
import BoardElts from "./map/BoardElts";
import RowElts from "./map/RowElts";

function Boards() {
  const { farmId, parcelId } = useParams();
  const [farm, setFarm] = useState<CFarm | null>(null);
  const [parcel, setParcel] = useState<CParcel | null>();
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const [selectedGeomId, setSelectedGeomId] = useState<string | null>(null);
  const { setCurrentFarm, currentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  useEffect(() => {
    let f;
    if (currentFarm === null) {
      if (farmId) {
        f = getCFarm(farmId);
        setCurrentFarm(f);
        setFarm(f);
      }
    } else {
      if (farmId === currentFarm.id) {
        f = currentFarm;
        setFarm(f);
      }
    }

    if (f) {
      const p: CParcel | undefined = f.parcels.find(
        ({ id }) => id === parcelId,
      );
      if (p) {
        if (p.boards.length !== 0) {
          const bds = p.boards
            .map((b) => b.getLatLngs())
            .reduce((acc, cur) => [...acc, ...cur], []);
          setBounds(bds);
          setViewBounds(bds);
        }
        setParcel(p);
      } else {
        console.error("parcelId unknown");
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        {farm && (
          <>
            <FarmElts farms={[farm]} />
            {parcel && (
              <>
                <ParcelElts parcels={[parcel]} />
                {parcel.boards.length && (
                  <>
                    <BoardElts
                      boards={parcel.boards}
                      selectedGeomId={selectedGeomId}
                      setSelectedGeomId={setSelectedGeomId}
                    />
                    {parcel.boards.map((b, i) => (
                      <RowElts
                        key={`${i}-rows`}
                        rows={b.rows}
                        selectedGeomId={selectedGeomId}
                        setSelectedGeomId={setSelectedGeomId}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>,
    );
  }, [parcel, farm, selectedGeomId]);

  return (
    <>
      {farm && (
        <>
          {parcel && (
            <>
              {parcel.boards.map(({ id, name, rows, color, getLatLngs }) => (
                <Card
                  extra={
                    <div
                      className="color"
                      style={{
                        background: color,
                        width: "22px",
                        height: "22px",
                        borderRadius: "15px",
                      }}
                    ></div>
                  }
                  title={
                    <div
                      style={{
                        fontWeight: selectedGeomId === id ? "bold" : "normal",
                      }}
                    >
                      {name}
                    </div>
                  }
                  key={`${id}-card`}
                  onMouseEnter={() => {
                    setSelectedGeomId(id);
                    setViewBounds(getLatLngs());
                  }}
                  onMouseLeave={() => {
                    setSelectedGeomId(null);
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
                          setSelectedGeomId(r.id);
                          setViewBounds(r.getLatLngs());
                        }}
                        onMouseLeave={() => {
                          setSelectedGeomId(null);
                          setViewBounds(bounds);
                        }}
                      >
                        <>
                          <div
                            style={{
                              fontWeight:
                                selectedGeomId === r.id ? "bold" : "normal",
                            }}
                          >
                            {r.name}
                          </div>
                          <div
                            className="color"
                            style={{
                              background: r.color,
                            }}
                          ></div>
                        </>
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
