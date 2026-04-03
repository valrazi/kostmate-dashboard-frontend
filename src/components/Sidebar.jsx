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
  RightOutlined,
  LeftOutlined
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
      trigger={null}
      width={200}
      collapsedWidth={80}
      breakpoint="md"
      onBreakpoint={(broken) => setCollapsed(broken)}
      theme="light"
      style={{ 
        background: '#fff', 
        position: 'relative',
        willChange: 'width',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="min-h-screen shadow-lg rounded-3xl flex flex-col justify-between"
    >
      {/* ATAS */}
      <div>
        {/* Logo */}
        <div className="flex justify-center py-4" style={{ willChange: 'transform' }}>
          <img
            src="/src/assets/img/Vector 679.png"
            alt="logo"
            className={`object-contain transition-all duration-200
              ${collapsed ? 'w-6 md:w-10' : 'w-10'}`}
            style={{ willChange: 'width' }}
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
          inlineCollapsed={collapsed}
          className="text-sm md:text-base"
        />
      </div>

      {/* TOGGLE BUTTON - BOTTOM CENTER OVERFLOW */}
      <div className="flex justify-end px-2 pb-4" style={{ position: 'relative' }}>
        <Button
          onClick={toggleSidebar}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            marginRight: '-20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          }}
        >
          {collapsed ? <RightOutlined className="text-lg text-gray-700" /> : <LeftOutlined className="text-lg text-gray-700" />}
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;