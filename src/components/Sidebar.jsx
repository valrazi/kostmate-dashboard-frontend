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
  LogoutOutlined,
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

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/branch/room', icon: <BranchesOutlined />, label: 'Branch' },
    { key: '/users', icon: <UserOutlined />, label: 'Customer' },
    { key: '/payment', icon: <CreditCardOutlined />, label: 'Payment' },
    { key: '/notification', icon: <BellOutlined />, label: 'Notification' },
    {
      type: 'group',
      label: <div className="px-4">
        <div className="border-t border-gray-300"></div>
      </div>
    },
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
      className="min-h-screen shadow-lg rounded-3xl"
      style={{ background: '#fff' }}
    >
      <div className="flex flex-col h-full">

        {/* ATAS */}
        <div>
          {/* Logo */}
          <div className="flex justify-center py-4">
            <img
              src="/src/assets/img/logokostmate.png"
              alt="logo"
              className={`object-contain transition-all duration-200
                ${collapsed ? 'w-6 md:w-10' : 'w-12'}`}
            />
          </div>

          {/* Menu */}
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['/branch/room']}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            inlineCollapsed={collapsed}
          />
        </div>

        {/* 🔽 DORONG KE BAWAH */}
        <div className="mt-auto flex flex-col gap-2 px-2 pb-4">

          {/* TOGGLE */}
          <div className="flex justify-end">
            <Button
              onClick={toggleSidebar}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                marginRight: '-15px',
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
              {collapsed
                ? <RightOutlined className="text-sm text-gray-700" />
                : <LeftOutlined className="text-sm text-gray-700" />
              }
            </Button>
          </div>

          {/* 🔴 LOGOUT PALING BAWAH */}
          <Menu
            mode="inline"
            selectable={false}
            inlineCollapsed={collapsed}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
                className: `
                  !bg-red-500 
                  hover:!bg-red-600 
                  !text-white 
                  hover:!text-white 
                  rounded-lg
                `
              }
            ]}
          />

        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;