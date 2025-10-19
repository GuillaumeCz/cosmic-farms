import { bounds, LatLng, Point } from "leaflet";
import { useEffect, type JSX } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import './Map.css';

const ViewBounds = ({ elts }: { elts?: LatLng[] }) => {
  const map = useMap();
  useEffect(() => {
    if (elts) {
      const c = elts.map(e => new Point(e.lat, e.lng));
      const { max, min } = bounds(c)
      if (max && min) {
        const d = [new LatLng(max.x + 0.001, max.y + 0.001), new LatLng(min.x - 0.001, min.y - 0.001)];
        map.fitBounds(d);
      }
    }
  }, [])
  return (<></>)
}

function Map({ viewBounds, children, }: { viewBounds?: LatLng[], children?: JSX.Element }) {
  return (
    <MapContainer center={[44.3502628, 3.6953171]} zoom={13} id={"map"}>
      {children}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ViewBounds elts={viewBounds} />
    </MapContainer>
  )
}

export default Map;
