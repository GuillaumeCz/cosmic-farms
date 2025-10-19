import { type JSX, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Farm, Parcel } from "./types";
import { getFarm } from "./data";
import Card from "antd/es/card/Card";
import { Marker, Polygon, Tooltip } from "react-leaflet";

import './Boards.css';
import { LatLng } from "leaflet";
import BaseContent from "./BaseContent";

function Boards() {
  const { farmId, parcelId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [parcel, setParcel] = useState<Parcel | null>();
  const [viewBounds, setViewBounds] = useState<LatLng[]>();
  const [mapChildren, setMapChildren] = useState<JSX.Element>()

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      if (f) {
        setFarm(f)
        const p: Parcel | undefined = f.parcels.find((p) => p.id === parcelId);
        if (p) {
          setParcel(p);
          const vb = p.boards
            .map(({ coordinates }) => coordinates)
            .reduce((acc, cur) => [...acc, ...cur], []);
          setViewBounds(vb);
        }
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        {farm && (
          <Marker
            position={farm.coordinates}
            key={`${farm.id}-map`}>
            <Tooltip>{farm.name}</Tooltip>
          </Marker>
        )}
        {parcel && (
          <>
            <Polygon pathOptions={{ color: 'grey' }} positions={parcel.coordinates}>
              <Tooltip>{parcel.name}</Tooltip>
            </Polygon>
            {parcel.boards.length > 0 && parcel.boards.map(b => (
              <Polygon pathOptions={{ color: 'red' }} positions={b.coordinates} key={b.id}>
                <Tooltip>{b.name}</Tooltip>
              </Polygon>
            ))}
          </>
        )}
      </>
    );
  }, [parcel, farm])

  return (
    <BaseContent viewBounds={viewBounds} mapChildren={mapChildren}>
      <div className="boards-list">
        {farm && (
          <>
            <p>{farm.name}</p>
            {parcel && (
              <>
                <p>{parcel.name}</p>
                <p>Number of boards {parcel.boards.length}</p>
                {parcel.boards.map(b => (
                  <Card title={b.name} key={`${b.id}-card`}>
                    <p>Number of rows {b.rows.length}</p>
                  </Card>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </BaseContent>
  )
}

export default Boards;
