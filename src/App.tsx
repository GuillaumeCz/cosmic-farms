import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Farms from './Farms';
import Parcels from './Parcels';

import './App.css'
import Boards from './Boards';


const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header id='header'>
        Cosmic farm !
      </Header>
      <Layout id='layout'>
        <Content id='content'>
          <Routes>
            <Route path='/' index element={<Farms />} />
            <Route path='/farms' element={<Farms />} />
            <Route path='/farms/:farmId' element={<Parcels />} />
            <Route path='/farms/:farmId/parcels' element={<Parcels />} />
            <Route path='/farms/:farmId/parcels/:parcelId' element={<Boards />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

