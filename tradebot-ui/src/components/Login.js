import React from 'react';
import { Layout, Breadcrumb, Typography } from 'antd';

import TBLogo from './TBLogo';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function Login() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Layout
        style={{
          display: 'inline-block',
          width: '100%',
          maxWidth: '500px',
          marginTop: '24px',
        }}
        className='site-layout-background'
      >
        <Title className='site-layout-background' style={{ padding: '24px' }}>Log In / Sign Up</Title>
      </Layout>
    </div>
  )
}

export default Login;
