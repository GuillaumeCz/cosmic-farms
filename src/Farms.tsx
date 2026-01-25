import { useState, useEffect, useContext } from "react";
import type { Farm } from "./types";
import { Link, useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import { getFarms } from "./data";
import { geoJsonToLatLng } from "./utils";
import { List, Card, Button } from "antd";
import {
  CurrentFarmContext,
  MapContext,
  type CurrentFarmContextType,
  type MapContextType,
} from "./Providers";
import FarmElts from "./map/FarmElts";

function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [bounds, setBounds] = useState<LatLng[]>([]);
  const { setCurrentFarm } = useContext(
    CurrentFarmContext,
  ) as CurrentFarmContextType;

  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  const navigate = useNavigate();

  useEffect(() => {
    const fs = getFarms();
    const bds = fs.map(({ coordinates: { geometry } }) =>
      geoJsonToLatLng(geometry),
    );

    setBounds(bds);
    setViewBounds(bds);

    setFarms(fs);
    setCurrentFarm(null);
  }, []);

  useEffect(() => {
    setMapChildren(<>{farms.length > 0 && <FarmElts farms={farms} />}</>);
  }, [farms]);

  return (
    <>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/farms/new")}
      >
        New Farm
      </Button>
      {farms.length > 0 && (
        <>
          {farms.map(
            ({
              name,
              id,
              owner,
              parcels,
              coordinates: { geometry },
              color,
            }) => (
              <Card
                hoverable
                title={name}
                key={id}
                extra={
                  <div className="color" style={{ background: color }}></div>
                }
                onMouseEnter={() => setViewBounds([geoJsonToLatLng(geometry)])}
                onMouseLeave={() => setViewBounds(bounds)}
              >
                <p>Owner: {owner}</p>
                <List
                  size="small"
                  bordered
                  dataSource={parcels}
                  header={<div>Number of parcels: {parcels.length}</div>}
                  renderItem={(p) => (
                    <List.Item
                      actions={[
                        <Link to={`/farms/${id}/parcels/${p.id}`}>See</Link>,
                      ]}
                    >
                      {p.name}
                    </List.Item>
                  )}
                />

                <Button onClick={() => navigate(`/farms/${id}/new`)}>
                  New parcel
                </Button>
                <Link to={`/farms/${id}`}>Sell all parcels</Link>
              </Card>
            ),
          )}
        </>
      )}
    </>
  );
}

export default Farms;
