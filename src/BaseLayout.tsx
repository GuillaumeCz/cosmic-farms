import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { Typography } from "antd";
import BreadCrumb from "./BreadCrumb";
import Map from "./map/Map";

import "./BaseLayout.css";
import { CurrentFarmContext, type CurrentFarmContextType } from "./Providers";

const { Title } = Typography;
const BaseLayout = ({}: {}) => {
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
        <Map />
      </div>
    </>
  );
};

export default BaseLayout;
