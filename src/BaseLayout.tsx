import { Outlet } from "react-router-dom";
import type { LatLng } from "leaflet";
import { useContext, type JSX } from "react";
import { Typography } from "antd";
import BreadCrumb from "./BreadCrumb";
import Map from "./Map";

import "./BaseLayout.css";
import { CurrentFarmContext, type CurrentFarmContextType } from "./Providers";

const { Title } = Typography;
const BaseLayout = ({
  viewBounds,
  mapChildren,
}: {
  viewBounds?: LatLng[];
  mapChildren?: JSX.Element;
}) => {
  const { currentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;
  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <div>
        <Title>
          {currentFarm && <>{currentFarm.name}</>}
          {!currentFarm && <>Cosmic farming !</>}
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
