import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Farms from "./Farms";
import FarmForm from "./forms/FarmForm";
import Parcels from "./Parcels";
import Boards from "./Boards";

import "./App.css";
import BaseLayout from "./BaseLayout";
import Providers from "./Providers";
import NewParcel from "./NewParcel";
import NewBoard from "./NewBoard";
import NewRow from "./NewRow";

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
                <Route path="/farms/new" element={<FarmForm />} />
                <Route path="/farms" element={<Farms />} />
                <Route path="/farms/:farmId/edit" element={<FarmForm />} />
                <Route path="/farms/:farmId/new" element={<NewParcel />} />
                <Route path="/farms/:farmId" element={<Parcels />} />
                <Route path="/farms/:farmId/parcels" element={<Parcels />} />
                <Route
                  path="/farms/:farmId/parcels/:parcelId/new"
                  element={<NewBoard />}
                />
                <Route
                  path="/farms/:farmId/parcels/:parcelId"
                  element={<Boards />}
                />
                <Route
                  path="/farms/:farmId/parcels/:parcelId/boards/:boardId/new"
                  element={<NewRow />}
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
