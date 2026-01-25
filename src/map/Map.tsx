import { LatLng, LatLngBounds, type LatLngExpression } from "leaflet";
import { useContext, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import "./Map.css";
import { MapContext, type MapContextType } from "../Providers";

const ViewBounds = ({ elts }: { elts?: LatLng[] }) => {
  const map = useMap();
  useEffect(() => {
    if (elts) {
      // TODO: Find a way to properly fit viewBounds when there's 2 points...
      if (elts.length === 1) {
        map.flyToBounds(elts[0].toBounds(200));
      } else {
        map.flyToBounds(
          new LatLngBounds(
            elts
              .map((e) => {
                const b = e.toBounds(10);
                return [b.getNorthWest(), b.getSouthEast()];
              })
              .reduce((acc, cur) => [...acc, ...cur], []),
          ),
        );
      }
    }
  }, [map, elts]);
  return null;
};

const Map = ({
  center = [44.3502628, 3.6953171],
  maxZoom = 23,
  zoom = 13,
}: {
  center?: LatLngExpression;
  maxZoom?: number;
  zoom?: number;
}) => {
  const { viewBounds, mapChildren: children } = useContext(
    MapContext,
  ) as MapContextType;
  return (
    <MapContainer center={center} maxZoom={maxZoom} zoom={zoom} id={"map"}>
      {children}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {viewBounds && <ViewBounds elts={viewBounds} />}
    </MapContainer>
  );
};

export default Map;
