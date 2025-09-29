import { Layout } from 'antd';
import { MapContainer, TileLayer } from 'react-leaflet';

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
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div style={{ width: '100%' }}>Content</div>
          <div style={{ width: '100%' }}>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id={"map"} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};

export default App;

