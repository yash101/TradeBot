import React from 'react';
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import { HomeOutlined, RobotOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

import TBLogo from './TBLogo';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function PageLayout(props) {
  let breadcrumbs = props.breadcrumbs || ['/'];

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={[props.selectedMenuItem]}
        >
          <TBLogo width={200} />
          <Menu.Item key='home' icon={<HomeOutlined />}>
            <NavLink to='/'>Home</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout' style={{ marginLeft: 200 }}>
        <Title className='site-layout-background' style={{ padding: '24px' }}>{props.pageTitle}</Title>
        <Content style={{ marginLeft: '24px' }}>
          <Breadcrumb style={{ paddingRight: '0'}}>
            {breadcrumbs.map(itm => (
              <Breadcrumb.Item>{itm}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </Content>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className='site-layout-background' style={{ padding: 24, textAlign: 'center' }}>
            <div>{props.children}</div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Devyash Lodha &copy; 2020</Footer>
      </Layout>
    </Layout>
  )
}

export default PageLayout;
