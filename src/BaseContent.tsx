import { type JSX } from "react";
import BreadCrumb from "./BreadCrumb";
import type { LatLng } from "leaflet";
import Map from "./Map";

import "./BaseContent.css";

function BaseContent({
  viewBounds,
  mapChildren,
  children,
}: {
  viewBounds?: LatLng[];
  mapChildren?: JSX.Element;
  children: JSX.Element;
}) {
  return (
    <>
      <BreadCrumb />
      <div className="container">
        <div className="content">{children}</div>
        <Map viewBounds={viewBounds}>{mapChildren}</Map>
      </div>
    </>
  );
}

export default BaseContent;
