import { useState, useEffect, type JSX } from "react";
import Card from "antd/es/card/Card";
import type { Farm } from "./types";
import { getFarm } from "./data";
import { Marker, Polygon, Tooltip } from "react-leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LatLng } from "leaflet";

import BaseContent from "./BaseContent";

function Parcels() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [viewBounds, setViewBounds] = useState<LatLng[]>();
  const [mapChildren, setMapChildren] = useState<JSX.Element>();

  const navigate = useNavigate();

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      setFarm(f);
    }

    if (f && f.parcels) {
      const vb = f.parcels
        .map(({ coordinates }) => coordinates)
        .reduce((acc, cur) => [...acc, ...cur], []);
      setViewBounds(vb);
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        {farm && (
          <>
            <Marker
              eventHandlers={{ click: () => navigate(`/farms/${farm.id}`) }}
              position={farm.coordinates}
              key={`${farm.id}-map`}
            >
              <Tooltip>{farm.name}</Tooltip>
            </Marker>
            {farm.parcels.length > 0 &&
              farm.parcels.map((p) => (
                <Polygon
                  pathOptions={{ color: "red" }}
                  positions={p.coordinates}
                  key={`${farm.id}-${p.id}`}
                  eventHandlers={{
                    click: () => navigate(`/farms/${farm.id}/parcels/${p.id}`),
                  }}
                >
                  <Tooltip>{p.name}</Tooltip>
                </Polygon>
              ))}
          </>
        )}
      </>,
    );
  }, [farm]);

  return (
    <BaseContent viewBounds={viewBounds} mapChildren={mapChildren}>
      <>
        {farm && (
          <>
            {farm.name}
            {farm.parcels.map((p) => (
              <Card
                title={p.name}
                key={p.id}
                extra={<Link to={`/farms/${farm.id}/parcels/${p.id}`}>+</Link>}
              >
                Bla blahh
                <p>Number of boards {p.boards.length}</p>
              </Card>
            ))}
          </>
        )}
      </>
    </BaseContent>
  );
}

export default Parcels;
