import { GeoJSON, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Dispatch } from "react";
import { CRow } from "../models";
import type { LineString, Point } from "geojson";

const RowElts = ({
  rows,
  selectedGeomId,
  setSelectedGeomId,
}: {
  rows: CRow<LineString | Point>[];
  selectedGeomId?: string | null;
  setSelectedGeomId?: Dispatch<string | null>;
}) => (
  <>
    {rows.length > 0 &&
      rows.map(({ geojson, id, color, name }) => (
        <GeoJSON
          data={geojson}
          key={id}
          pathOptions={{
            color,
            weight: selectedGeomId === id ? 7 : 3,
          }}
          eventHandlers={{
            mouseover: () => setSelectedGeomId && setSelectedGeomId(id),
            mouseout: () => setSelectedGeomId && setSelectedGeomId(null),
          }}
          pointToLayer={(_, pos) => L.circleMarker(pos, { radius: 5 })}
        >
          <Tooltip>{name}</Tooltip>
        </GeoJSON>
      ))}
  </>
);

export default RowElts;
