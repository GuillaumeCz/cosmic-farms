import { Breadcrumb } from "antd";
import { useContext, useEffect, useState, type JSX } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CurrentFarmContext, type CurrentFarmContextType } from "./Providers";

function BreadCrumb() {
  const location = useLocation();
  const params = useParams();
  const [items, setItems] = useState<(string | JSX.Element)[]>([]);
  const { currentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;

  // TODO: Understand why `currentFarm` alway values `null` fist time even if nothing sets it to this value...
  useEffect(() => {
    const locItems = location.pathname.split("/");
    setItems(
      locItems.map((value, index) => {
        // Home
        if (index === 0) {
          return <Link to="/">Home</Link>;
        }

        // Last
        if (
          index === locItems.length - 1 ||
          !Object.values(params).includes(value)
        ) {
          if (!currentFarm) {
            return value;
          }

          if (index === 2) {
            return currentFarm.name;
          }
          const parcel = currentFarm.parcels.find((p) => p.id === value);
          return parcel ? parcel.name : value;
        }

        if (index === 2 && currentFarm) {
          return (
            <Link to={locItems.slice(0, index + 1).join("/")}>
              {currentFarm.name}
            </Link>
          );
        }

        return <Link to={locItems.slice(0, index + 1).join("/")}>{value}</Link>;
      }),
    );
  }, [location, currentFarm]);

  return <Breadcrumb items={items.map((i) => ({ title: i }))} />;
}

export default BreadCrumb;
