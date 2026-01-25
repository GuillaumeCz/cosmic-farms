import type { Dispatch } from "react";
import type { Board } from "../types";
import { Tooltip, GeoJSON } from "react-leaflet";

const BoardElts = ({
  boards,
  selectedGeomId,
  setSelectedGeomId,
}: {
  boards: Board[];
  selectedGeomId?: string | null;
  setSelectedGeomId?: Dispatch<string | null>;
}) => (
  <>
    {boards.map(({ id, coordinates, name, color }) => (
      <div key={id + "-boards"}>
        <GeoJSON
          pathOptions={{
            color,
            weight: selectedGeomId === id ? 7 : 3,
          }}
          data={coordinates}
          key={id}
          eventHandlers={{
            mouseover: () => setSelectedGeomId && setSelectedGeomId(id),
            mouseout: () => setSelectedGeomId && setSelectedGeomId(null),
          }}
        >
          <Tooltip>{name}</Tooltip>
        </GeoJSON>
      </div>
    ))}
  </>
);

export default BoardElts;
