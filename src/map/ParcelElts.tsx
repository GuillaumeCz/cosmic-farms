import type { Parcel } from "../types";
import { useNavigate } from "react-router-dom";
import { GeoJSON, Tooltip } from "react-leaflet";
import type { Dispatch } from "react";

const ParcelElts = ({
  parcels,
  farmId,
  selectedGeomId,
  setSelectedGeomId,
}: {
  parcels: Parcel[];
  farmId?: string;
  selectedGeomId?: string | null;
  setSelectedGeomId?: Dispatch<string | null>;
}) => {
  const navigate = useNavigate();

  return (
    <>
      {parcels.map(({ coordinates, id, name, color }) => (
        <GeoJSON
          data={coordinates}
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
