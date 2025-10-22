import { Outlet } from "react-router-dom";
import type { LatLng } from "leaflet";
import type { JSX } from "react";
import { Typography } from "antd";
import BreadCrumb from "./BreadCrumb";
import Map from "./Map";
import type { Farm } from "./types";

import "./BaseLayout.css";

const { Title } = Typography;
const BaseLayout = ({
  viewBounds,
  mapChildren,
  farm,
}: {
  viewBounds?: LatLng[];
  mapChildren?: JSX.Element;
  farm?: Farm | null;
}) => {
  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <div>
        <Title>
          {farm && <>{farm.name}</>}
          {!farm && <>Cosmic farming !</>}
        </Title>
      </div>
      <div className="container">
        <div className="content">
          <Outlet />
        </div>
        <Map viewBounds={viewBounds}>{mapChildren}</Map>
      </div>
    </>
  );
};

export default BaseLayout;
