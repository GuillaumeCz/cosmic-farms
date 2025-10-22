import { Layout } from "antd";
import { type JSX, useState } from "react";
import { LatLng } from "leaflet";
import { Route, Routes } from "react-router-dom";
import Farms from "./Farms";
import Parcels from "./Parcels";
import Boards from "./Boards";

import "./App.css";
import BaseLayout from "./BaseLayout";
import type { Farm } from "./types";

const { Header, Content } = Layout;

function App() {
  const [viewBounds, setViewBounds] = useState<LatLng[]>();
  const [mapChildren, setMapChildren] = useState<JSX.Element>();
  const [farm, setFarm] = useState<Farm | null>();

  return (
    <Layout>
      <Header id="header">Cosmic farm !</Header>
      <Layout id="layout">
        <Content id="content">
          <Routes>
            <Route
              path="/"
              element={
                <BaseLayout
                  farm={farm}
                  viewBounds={viewBounds}
                  mapChildren={mapChildren}
                />
              }
            >
              <Route
                index
                element={
                  <Farms
                    setViewBounds={setViewBounds}
                    setMapChildren={setMapChildren}
                    resetFarmObject={() => setFarm(null)}
                  />
                }
              />
              <Route
                path="/farms"
                element={
                  <Farms
                    setViewBounds={setViewBounds}
                    setMapChildren={setMapChildren}
                    resetFarmObject={() => setFarm(null)}
                  />
                }
              />
              <Route
                path="/farms/:farmId"
                element={
                  <Parcels
                    setViewBounds={setViewBounds}
                    setMapChildren={setMapChildren}
                    setFarmObject={setFarm}
                  />
                }
              />
              <Route
                path="/farms/:farmId/parcels"
                element={
                  <Parcels
                    setViewBounds={setViewBounds}
                    setMapChildren={setMapChildren}
                    setFarmObject={setFarm}
                  />
                }
              />
              <Route
                path="/farms/:farmId/parcels/:parcelId"
                element={
                  <Boards
                    setViewBounds={setViewBounds}
                    setMapChildren={setMapChildren}
                    setFarmObject={setFarm}
                  />
                }
              />
            </Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
