import type { Parcel } from "../types";
import { useNavigate } from "react-router-dom";
import { GeoJSON, Tooltip } from "react-leaflet";

const ParcelElts = ({
  parcels,
  farmId,
  selectedGeomId,
}: {
  parcels: Parcel[];
  farmId?: string;
  selectedGeomId?: string | null;
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
