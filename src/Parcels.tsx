import { useState, useEffect, useContext } from "react";
import { List, Button, type CollapseProps, Collapse } from "antd";
import { Farm } from "./models";
import { getFarm } from "./data";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LatLng } from "leaflet";
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
  const [_, setBounds] = useState<LatLng[]>([]);
  const [selectedGeomId, setSelectedGeomId] = useState<string | null>(null);
  const [collapseItems, setCollapseItems] = useState<CollapseProps["items"]>();
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
        .map((p) => p.getLatLngs())
        .reduce((acc, curr) => [...acc, ...curr], []);
      setBounds(bds);
      setViewBounds(bds);
    }
  }, []);

  useEffect(() => {
    if (farm) {
      setCollapseItems([
        ...farm.parcels.map(({ id, color, name, boards, getLatLngs }) => ({
          key: id,
          label: (
            <div
              onMouseEnter={() => {
                setSelectedGeomId(id);
                setViewBounds(getLatLngs());
              }}
            >
              {name}
            </div>
          ),
          extra: (
            <div
              className="color"
              style={{
                background: color,
              }}
            ></div>
          ),
          children: (
            <>
              <List
                size="small"
                bordered
                dataSource={boards}
                header={<div>Number of boards: {boards.length}</div>}
                renderItem={(b) => <List.Item>{b.name}</List.Item>}
              />
              <Button
                onClick={() => navigate(`/farms/${farmId}/parcels/${id}/new`)}
              >
                New board
              </Button>
              <Link to={`/farms/${farm.id}/parcels/${id}`}>See all boards</Link>
            </>
          ),
        })),
      ]);
    }

    setMapChildren(
      <>
        {farm && (
          <>
            <FarmElts farms={[farm]} />
            {farm.parcels.length > 0 && (
              <ParcelElts
                parcels={farm.parcels}
                selectedGeomId={selectedGeomId}
                setSelectedGeomId={setSelectedGeomId}
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
          <Collapse
            accordion
            items={collapseItems}
            activeKey={selectedGeomId ?? undefined}
          />
        </>
      )}
    </>
  );
}

export default Parcels;
