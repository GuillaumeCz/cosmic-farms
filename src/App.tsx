import { Layout } from "antd";
import { type JSX, useState } from "react";
import { LatLng } from "leaflet";
import { Route, Routes } from "react-router-dom";
import Farms from "./Farms";
import Parcels from "./Parcels";
import Boards from "./Boards";

import "./App.css";
import BaseLayout from "./BaseLayout";
import Providers from "./Providers";

const { Header, Content } = Layout;

function App() {
  const [viewBounds, setViewBounds] = useState<LatLng[]>();
  const [mapChildren, setMapChildren] = useState<JSX.Element>();

  return (
    <Layout>
      <Header id="header">Cosmic farm !</Header>
      <Layout id="layout">
        <Content id="content">
          <Providers>
            <Routes>
              <Route
                path="/"
                element={
                  <BaseLayout
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
                    />
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <Farms
                      setViewBounds={setViewBounds}
                      setMapChildren={setMapChildren}
                    />
                  }
                />
                <Route
                  path="/farms/:farmId"
                  element={
                    <Parcels
                      setViewBounds={setViewBounds}
                      setMapChildren={setMapChildren}
                    />
                  }
                />
                <Route
                  path="/farms/:farmId/parcels"
                  element={
                    <Parcels
                      setViewBounds={setViewBounds}
                      setMapChildren={setMapChildren}
                    />
                  }
                />
                <Route
                  path="/farms/:farmId/parcels/:parcelId"
                  element={
                    <Boards
                      setViewBounds={setViewBounds}
                      setMapChildren={setMapChildren}
                    />
                  }
                />
              </Route>
            </Routes>
          </Providers>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
