import { useNavigate } from "react-router-dom";
import { GeoJSON, Tooltip } from "react-leaflet";
import type { Dispatch } from "react";
import { CParcel } from "../models";

const ParcelElts = ({
  parcels,
  farmId,
  selectedGeomId,
  setSelectedGeomId,
}: {
  parcels: CParcel[];
  farmId?: string;
  selectedGeomId?: string | null;
  setSelectedGeomId?: Dispatch<string | null>;
}) => {
  const navigate = useNavigate();

  return (
    <>
      {parcels.map(({ geojson, id, name, color }) => (
        <GeoJSON
          data={geojson}
          key={`${farmId}-${id}`}
          pathOptions={{
            color: farmId ? color : "grey",
            weight:
              farmId && selectedGeomId ? (selectedGeomId === id ? 7 : 3) : 3,
            fillOpacity: farmId ? 0.3 : 0,
          }}
          eventHandlers={{
            mouseover: () => setSelectedGeomId && setSelectedGeomId(id),
            click: () =>
              farmId ? navigate(`/farms/${farmId}/parcels/${id}`) : () => {},
          }}
        >
          <Tooltip>{name}</Tooltip>
        </GeoJSON>
      ))}
    </>
  );
};

export default ParcelElts;
