import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BranchesOutlined,
  CreditCardOutlined,
  BellOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/branch', icon: <BranchesOutlined />, label: 'Branch' },
    { key: '/users', icon: <UserOutlined />, label: 'Customer' },
    { key: '/payment', icon: <CreditCardOutlined />, label: 'Payment' },
    { key: '/notification', icon: <BellOutlined />, label: 'Notification' },
    { type: 'divider' },
    { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
    { key: '/account', icon: <SettingOutlined />, label: 'Account' },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null} // tombol toggle custom
      width={200}
      collapsedWidth={80}
      breakpoint="md" // responsive di medium screen
      onBreakpoint={(broken) => setCollapsed(broken)} // auto collapse di mobile
      theme="light"
      style={{ background: '#fff' }}
      className="min-h-screen shadow-lg rounded-3xl flex flex-col justify-between"
    >
      {/* ATAS */}
      <div>
        {/* Logo */}
        <div className="flex justify-center py-4">
          <img
            src="/src/assets/img/Vector 679.png"
            alt="logo"
            className={`object-contain transition-all 
              ${collapsed ? 'w-6 md:w-10' : 'w-10'}`
            }
          />
        </div>

        {/* Menu */}
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#fff' }}
          inlineCollapsed={collapsed} // icon only saat collapsed
          className="text-sm md:text-base" // ukuran huruf responsive
        />
      </div>

      {/* BAWAH (TOMBOL TOGGLE) */}
      <div className="p-3">
        <Button
          type="text"
          onClick={toggleSidebar}
          className="w-full flex justify-center items-center"
        >
          {collapsed ? <MenuUnfoldOutlined className="text-lg md:text-xl" /> : <MenuFoldOutlined className="text-lg md:text-xl" />}
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;