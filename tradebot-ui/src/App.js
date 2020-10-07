import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function App() {
  return (
    <Layout>
      <Header className="header">
        <div classname="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Home</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['submenu1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="submenu1" icon={<UserOutlined />} title="Subnav 1">
              <Menu.Item key="1">option 1</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >Content</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
