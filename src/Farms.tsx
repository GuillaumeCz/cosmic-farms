import { useState, useEffect, type JSX } from "react";
import Card from "antd/es/card/Card";
import type { Farm } from "./types";
import { Tooltip, GeoJSON } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import { getFarms } from "./data";
import { geoJsonToLatLng } from "./utils";

function Farms({
  setViewBounds,
  setMapChildren,
}: {
  setViewBounds: (v: LatLng[]) => void;
  setMapChildren: (v: JSX.Element) => void;
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
            extra={<Link to={`/farms/${f.id}`}>+</Link>}
          >
            <p>{f.owner}</p>
            <p>Number of parcels: {f.parcels.length}</p>
          </Card>
        ))}
    </>
  );
}

export default Farms;
