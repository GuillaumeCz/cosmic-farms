import L from "leaflet";
import type { Farm } from "../types";
import { useContext, useEffect } from "react";
import { MapContext, type MapContextType } from "../Providers";
import { useNavigate } from "react-router-dom";
import { Tooltip, GeoJSON } from "react-leaflet";

const FarmElts = ({ farms: farms }: { farms: Farm[] }) => {
  const { setMapChildren } = useContext(MapContext) as MapContextType;
  const navigate = useNavigate();

  useEffect(() => {
    setMapChildren(
      <>
        {farms.map(({ coordinates, id, name, color }) => (
          <GeoJSON
            data={coordinates}
            key={`${id}-farm`}
            eventHandlers={{ click: () => navigate(`/farms/${id}`) }}
            pointToLayer={(_, pos) => L.circleMarker(pos, { radius: 8 })}
            pathOptions={{ color }}
          >
            <Tooltip>{name}</Tooltip>
          </GeoJSON>
        ))}
      </>,
    );
  }, []);
  return <></>;
};

export default FarmElts;
