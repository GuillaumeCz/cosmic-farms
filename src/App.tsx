import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Farms from './Farms';
import Parcels from './Parcels';


const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
        Hello
      </Header>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path='/' index element={<Farms />} />
            <Route path='/farms' element={<Farms />} />
            <Route path='/farms/:farmId' element={<Parcels />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

