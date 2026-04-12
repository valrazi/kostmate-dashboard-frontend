// src/components/Header.jsx
import { Avatar, Dropdown } from 'antd';
import { LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

function Header({ title, username }) {
  const navigate = useNavigate();
  const clearUser = useAppStore((state) => state.clearUser);
  const [hover, setHover] = useState(false);

  // Ambil inisial nama (MA)
  const getInitial = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  const handleBackToBranch = () => {
    navigate('/branch'); // arahkan ke halaman branch
  };

  // Dropdown menu items
 const menuItems = [
  {
    key: 'back',
    label: 'Branch',
    icon: <ArrowLeftOutlined />,
    onClick: handleBackToBranch,
    className: 'hover:!bg-blue-100 transition-colors',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
    onClick: handleLogout,
    danger: true,
  },
];

  return (
    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
      {/* Kiri - Judul */}
      <div>
      <h1 className="text-sm sm:text-base md:text-xl lg:text-xl font-bold truncate">
        {title}
      </h1>
       <h1 className="text-sm sm:text-base md:text-xl lg:text-lg font-semibold truncate text-[#1B59F8]">
        Kost Anugrah (27/<span className='text-sm text-[#1B59F8]'>80</span>)
        
      </h1>
      </div>
     

      {/* Kanan - Profile */}
     <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
  <Dropdown menu={{ items: menuItems }} placement="bottomRight">
    <Avatar
      style={{
        backgroundColor: hover ? '#b7dcfa' : '#ffffff',
        color: '#1677ff',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        border: '1px solid #1677ff', // ✅ BORDER BIRU
      }}
      className="text-xs sm:text-sm md:text-base lg:text-lg"
      size={{ xs: 25, md: 35 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {getInitial(username)}
    </Avatar>
  </Dropdown>

  <span className="hidden sm:inline text-xs sm:text-sm md:text-base">
    {username}
  </span>
</div>
    </div>
  );
}

export default Header;