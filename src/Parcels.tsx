import { useState, useEffect, useContext } from "react";
import { List, Card } from "antd";
import type { Farm } from "./types";
import { getFarm } from "./data";
import { Tooltip, GeoJSON } from "react-leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LatLng } from "leaflet";
import { geometryToLatLng } from "./utils";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";
import ColorHash from "color-hash";

import "./shared.css";

function Parcels() {
  const { farmId } = useParams();
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [farm, setFarm] = useState<Farm | null>(null);
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const [eltsIdToColor, setEltsIdToColor] = useState<{ [key: string]: string }>(
    {},
  );

  const navigate = useNavigate();

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      setFarm(f);
    }

    if (f && f.parcels.length > 0) {
      const bds = f.parcels
        .map((p) => geometryToLatLng(p.coordinates.geometry))
        .reduce((acc, cur) => [...acc, ...cur], []);
      setBounds(bds);
      setViewBounds(bds);
      const idToColor: { [key: string]: string } = {};
      const ch = new ColorHash();
      f.parcels.forEach(({ id }) => {
        idToColor[id] = ch.hex(id);
      });
      setEltsIdToColor(idToColor);
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
          <>
            <GeoJSON
              data={farm.coordinates}
              key={`${farm.id}-farm`}
              eventHandlers={{ click: () => navigate(`/farms/${farm.id}`) }}
            >
              <Tooltip>{farm.name}</Tooltip>
            </GeoJSON>
            {farm.parcels.length > 0 &&
              farm.parcels.map((p) => (
                <GeoJSON
                  data={p.coordinates}
                  key={`${farm.id}-${p.id}`}
                  pathOptions={{ color: eltsIdToColor[p.id] }}
                  eventHandlers={{
                    click: () => navigate(`/farms/${farm.id}/parcels/${p.id}`),
                  }}
                >
                  <Tooltip>{p.name}</Tooltip>
                </GeoJSON>
              ))}
          </>
        )}
      </>,
    );
  }, [farm]);

  return (
    <>
      {!farm && <>Nothing ! </>}
      {farm && (
        <>
          {farm.parcels.map((p) => (
            <Card
              title={p.name}
              key={p.id}
              extra={
                <div
                  className="color"
                  style={{
                    background: eltsIdToColor[p.id],
                  }}
                ></div>
              }
              onMouseEnter={() =>
                setViewBounds(geometryToLatLng(p.coordinates.geometry))
              }
              onMouseLeave={() => setViewBounds(bounds)}
            >
              <List
                size="small"
                bordered
                dataSource={p.boards}
                header={<div>Number of boards: {p.boards.length}</div>}
                renderItem={(b) => <List.Item>{b.name}</List.Item>}
              ></List>
              <Link to={`/farms/${farm.id}/parcels/${p.id}`}>
                See all boards
              </Link>
            </Card>
          ))}
        </>
      )}
    </>
  );
}

export default Parcels;
