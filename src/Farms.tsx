import { useState, useEffect, useContext } from "react";
import type { Farm } from "./types";
import { Link, useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import { getFarms } from "./data";
import { geoJsonToLatLng } from "./utils";
import { List, Button, Collapse, type CollapseProps } from "antd";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";
import FarmElts from "./map/FarmElts";

function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [_, setBounds] = useState<LatLng[]>([]);
  const [collapseItems, setCollapseItems] = useState<CollapseProps["items"]>();
  const [selectedGeomId, setSelectedGeomId] = useState<string | null>(null);
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;

  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  const navigate = useNavigate();

  useEffect(() => {
    const fs = getFarms();
    const bds = fs.map(({ coordinates: { geometry } }) =>
      geoJsonToLatLng(geometry),
    );

    setBounds(bds);
    setViewBounds(bds);

    setFarms(fs);
    setSelectedGeomId(fs[0].id);
    setCurrentFarm(null);
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        {farms.length > 0 && (
          <FarmElts farms={farms} setSelectedGeomId={setSelectedGeomId} />
        )}
      </>,
    );
    setCollapseItems([
      ...farms.map(
        ({ name, owner, parcels, id, color, coordinates: { geometry } }) => ({
          key: id,
          label: (
            <div
              onMouseEnter={() => {
                setSelectedGeomId(id);
                setViewBounds([geoJsonToLatLng(geometry)]);
              }}
            >
              {name}
            </div>
          ),
          extra: <div className="color" style={{ background: color }}></div>,
          children: (
            <>
              <p>Owner: {owner}</p>
              <List
                size="small"
                bordered
                dataSource={parcels}
                header={<div>Number of parcels: {parcels.length}</div>}
                renderItem={(p) => (
                  <List.Item
                    actions={[
                      <Link to={`/farms/${id}/parcels/${p.id}`}>See</Link>,
                    ]}
                  >
                    {p.name}
                  </List.Item>
                )}
              />
              <Button onClick={() => navigate(`/farms/${id}/new`)}>
                New parcel
              </Button>
              <Link to={`/farms/${id}`}>Sell all parcels</Link>
            </>
          ),
        }),
      ),
    ]);
  }, [farms]);

  return (
    <>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/farms/new")}
      >
        New Farm
      </Button>

      {farms.length > 0 && (
        <>
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

export default Farms;
