import L from "leaflet";
import type { Farm } from "../types";
import { useNavigate } from "react-router-dom";
import { Tooltip, GeoJSON } from "react-leaflet";
import type { Dispatch } from "react";

const FarmElts = ({
  farms,
  setSelectedGeomId,
}: {
  farms: Farm[];
  setSelectedGeomId?: Dispatch<string | null>;
}) => {
  const navigate = useNavigate();

  return (
    <>
      {farms.map(({ coordinates, id, name, color }) => (
        <GeoJSON
          data={coordinates}
          key={`${id}-farm`}
          eventHandlers={{
            mouseover: () => setSelectedGeomId && setSelectedGeomId(id),
            click: () => navigate(`/farms/${id}`),
          }}
          pointToLayer={(_, pos) => L.circleMarker(pos, { radius: 8 })}
          pathOptions={{ color }}
        >
          <Tooltip>{name}</Tooltip>
        </GeoJSON>
      ))}
    </>
  );
};

export default FarmElts;
