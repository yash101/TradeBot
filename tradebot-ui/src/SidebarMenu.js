import { Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

function SidebarMenu() {
  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0
      }}
    >
    </Sider>
  );
}

export default SidebarMenu;
