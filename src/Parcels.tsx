import { useState, useEffect, useContext } from "react";
import { List, Card, Button } from "antd";
import { type Farm } from "./types";
import { getFarm } from "./data";
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
import FarmElts from "./map/FarmElts";
import ParcelElts from "./map/ParcelElts";

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
        if (f) {
          setFarm(f);
          setCurrentFarm(f);
        }
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
            <FarmElts farms={[farm]} />
            {farm.parcels.length > 0 && (
              <ParcelElts
                parcels={farm.parcels}
                selectedGeomId={selectedGeomId}
                farmId={farm.id}
              />
            )}
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
          <Button onClick={() => navigate(`/farms/${farm.id}/new`)}>
            New parcel
          </Button>
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
