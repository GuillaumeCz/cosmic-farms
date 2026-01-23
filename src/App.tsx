import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Farms from "./Farms";
import NewFarm from "./NewFarm";
import Parcels from "./Parcels";
import Boards from "./Boards";

import "./App.css";
import BaseLayout from "./BaseLayout";
import Providers from "./Providers";
import NewParcel from "./NewParcel";

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header id="header">Cosmic farm !</Header>
      <Layout id="layout">
        <Content id="content">
          <Providers>
            <Routes>
              <Route path="/" element={<BaseLayout />}>
                <Route index element={<Farms />} />
                <Route path="/farms/new" element={<NewFarm />} />
                <Route path="/farms" element={<Farms />} />
                <Route path="/farms/:farmId/new" element={<NewParcel />} />
                <Route path="/farms/:farmId" element={<Parcels />} />
                <Route path="/farms/:farmId/parcels" element={<Parcels />} />
                <Route
                  path="/farms/:farmId/parcels/:parcelId"
                  element={<Boards />}
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
