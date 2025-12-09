import { useState, useEffect, useContext } from "react";
import { List, Card } from "antd";
import { type Farm } from "./types";
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

import "./shared.css";

function Parcels() {
  const { farmId } = useParams();
  const { setCurrentFarm, currentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [farm, setFarm] = useState<Farm | null>(null);
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const [selectedGeomId, setSelectedGeomId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let f;
    if (currentFarm === null) {
      if (farmId) {
        f = getFarm(farmId);
        setFarm(f);
        setCurrentFarm(f);
      }
    } else {
      if (farmId === currentFarm.id) {
        f = currentFarm;
        setFarm(f);
      }
    }

    if (f && f.parcels.length > 0) {
      const bds = f.parcels
        .map(({ coordinates: { geometry } }) => geometryToLatLng(geometry))
        .reduce((acc, cur) => [...acc, ...cur], []);
      setBounds(bds);
      setViewBounds(bds);
    }
  }, []);

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
              farm.parcels.map(({ coordinates, id, name, color }) => (
                <GeoJSON
                  data={coordinates}
                  key={`${farm.id}-${id}`}
                  pathOptions={{ color, weight: selectedGeomId === id ? 7 : 3 }}
                  eventHandlers={{
                    click: () => navigate(`/farms/${farm.id}/parcels/${id}`),
                  }}
                >
                  <Tooltip>{name}</Tooltip>
                </GeoJSON>
              ))}
          </>
        )}
      </>,
    );
  }, [farm, selectedGeomId]);

  return (
    <>
      {!farm && <>Nothing ! </>}
      {farm && (
        <>
          {farm.parcels.map(
            ({ name, id, boards, coordinates: { geometry }, color }) => (
              <Card
                title={name}
                key={id}
                extra={
                  <div
                    className="color"
                    style={{
                      background: color,
                    }}
                  ></div>
                }
                onMouseEnter={() => {
                  setSelectedGeomId(id);
                  setViewBounds(geometryToLatLng(geometry));
                }}
                onMouseLeave={() => {
                  setSelectedGeomId(null);
                  setViewBounds(bounds);
                }}
              >
                <List
                  size="small"
                  bordered
                  dataSource={boards}
                  header={<div>Number of boards: {boards.length}</div>}
                  renderItem={(b) => <List.Item>{b.name}</List.Item>}
                ></List>
                <Link to={`/farms/${farm.id}/parcels/${id}`}>
                  See all boards
                </Link>
              </Card>
            ),
          )}
        </>
      )}
    </>
  );
}

export default Parcels;
