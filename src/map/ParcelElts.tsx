import type { Parcel } from "../types";
import { useContext, useEffect } from "react";
import { MapContext, type MapContextType } from "../Providers";
import { useNavigate } from "react-router-dom";
import { GeoJSON, Tooltip } from "react-leaflet";

const ParcelElts = ({
  parcels,
  farmId,
  selectedGeomId,
}: {
  parcels: Parcel[];
  farmId: string;
  selectedGeomId?: string | null;
}) => {
  const { setMapChildren } = useContext(MapContext) as MapContextType;
  const navigate = useNavigate();

  useEffect(() => {
    setMapChildren(
      <>
        {parcels.map(({ coordinates, id, name, color }) => (
          <GeoJSON
            data={coordinates}
            key={`${farmId}-${id}`}
            pathOptions={{ color, weight: selectedGeomId === id ? 7 : 3 }}
            eventHandlers={{
              click: () => navigate(`/farms/${farmId}/parcels/${id}`),
            }}
          >
            <Tooltip>{name}</Tooltip>
          </GeoJSON>
        ))}
      </>,
    );
  }, []);
  return <></>;
};

export default ParcelElts;
