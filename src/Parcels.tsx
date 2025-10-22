import { useState, useEffect, type JSX } from "react";
import Card from "antd/es/card/Card";
import type { Farm } from "./types";
import { getFarm } from "./data";
import { Tooltip, GeoJSON } from "react-leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LatLng } from "leaflet";
import { geometryToLatLng } from "./utils";

function Parcels({
  setViewBounds,
  setMapChildren,
}: {
  setViewBounds: (v: LatLng[]) => void;
  setMapChildren: (v: JSX.Element) => void;
}) {
  const { farmId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      setFarm(f);
    }

    if (f && f.parcels.length > 0) {
      const bounds = f.parcels
        .map((p) => geometryToLatLng(p.coordinates.geometry))
        .reduce((acc, cur) => [...acc, ...cur], []);
      setViewBounds(bounds);
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
              farm.parcels.map((p) => (
                <GeoJSON
                  data={p.coordinates}
                  key={`${farm.id}-${p.id}`}
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
  );
}

export default Parcels;
