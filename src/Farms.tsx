import { useState, useEffect, type JSX } from "react";
import type { Farm } from "./types";
import { Tooltip, GeoJSON } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import { getFarms } from "./data";
import { geoJsonToLatLng } from "./utils";
import { List, Card } from "antd";

function Farms({
  setViewBounds,
  setMapChildren,
  resetFarmObject,
}: {
  setViewBounds: (v: LatLng[]) => void;
  setMapChildren: (v: JSX.Element) => void;
  resetFarmObject: () => void;
}) {
  const [farms, setFarms] = useState<Farm[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fs = getFarms();

    const bounds = fs.map((f) => geoJsonToLatLng(f.coordinates.geometry));
    setViewBounds(bounds);
    setFarms(fs);
  }, []);
  useEffect(() => {
    resetFarmObject();
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
            title={f.name}
            key={f.id}
            extra={<Link to={`/farms/${f.id}`}>Sell all parcels</Link>}
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
