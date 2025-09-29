import { Layout } from 'antd';

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
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

