import { useState, useEffect, useContext } from "react";
import type { Farm } from "./types";
import { Tooltip, GeoJSON } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import { getFarms } from "./data";
import { geoJsonToLatLng } from "./utils";
import { List, Card } from "antd";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";

function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;

  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  const navigate = useNavigate();

  useEffect(() => {
    const fs = getFarms();
    const bds = fs.map((f) => geoJsonToLatLng(f.coordinates.geometry));

    setBounds(bds);

    setViewBounds(bds);
    setFarms(fs);
    setCurrentFarm(null);
  }, []);
  useEffect(() => {
    setMapChildren(
      <>
        {farms &&
          farms.map((f) => (
            <GeoJSON
              data={f.coordinates}
              key={`${f.id}-farm`}
              eventHandlers={{ click: () => navigate(`/farms/${f.id}`) }}
            >
              <Tooltip>{f.name}</Tooltip>
            </GeoJSON>
          ))}
      </>,
    );
  }, [farms]);

  return (
    <>
      {farms &&
        farms.map((f) => (
          <Card
            hoverable
            title={f.name}
            key={f.id}
            extra={<Link to={`/farms/${f.id}`}>Sell all parcels</Link>}
            onMouseEnter={() =>
              setViewBounds([geoJsonToLatLng(f.coordinates.geometry)])
            }
            onMouseLeave={() => setViewBounds(bounds)}
          >
            <p>Owner: {f.owner}</p>
            <List
              size="small"
              bordered
              dataSource={f.parcels}
              header={<div>Number of parcels: {f.parcels.length}</div>}
              renderItem={(p) => (
                <List.Item
                  actions={[
                    <Link to={`/farms/${f.id}/parcels/${p.id}`}>See</Link>,
                  ]}
                >
                  {p.name}
                </List.Item>
              )}
            />
          </Card>
        ))}
    </>
  );
}

export default Farms;
