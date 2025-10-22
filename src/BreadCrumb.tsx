import { Breadcrumb } from "antd";
import { useEffect, useState, type JSX } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function BreadCrumb() {
  const location = useLocation();
  const params = useParams();
  const [items, setItems] = useState<(string | JSX.Element)[]>([]);

  useEffect(() => {
    const locItems = location.pathname.split("/");
    setItems(
      locItems.map((value, index) => {
        if (index === 0) {
          return <Link to="/">Home</Link>;
        }
        if (
          index === locItems.length - 1 ||
          !Object.values(params).includes(value)
        ) {
          return value;
        }

        return <Link to={locItems.slice(0, index + 1).join("/")}>{value}</Link>;
      }),
    );
  }, [location]);

  return <Breadcrumb items={items.map((i) => ({ title: i }))} />;
}

export default BreadCrumb;
