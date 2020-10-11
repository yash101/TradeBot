import React from 'react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import Home from './components/Home';
import Error from './components/Error';

import logo from './logo.svg';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <NavLink to="/">Home</NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header className="site-layout-background" style={{ padding: 0 }}></Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
              <div>
                <Switch>
                  <Route path="/" component={Home} exact/>
                  <Route component={Error} />
                </Switch>
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Devyash Lodha &copy; 2020</Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
