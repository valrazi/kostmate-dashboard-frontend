// src/components/Header.jsx
import { Avatar } from 'antd';
import { useState } from 'react';

function Header({ title, username }) {
  const [hover, setHover] = useState(false);

  // Ambil inisial nama (MA)
  const getInitial = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
      {/* Kiri - Judul */}
      <h1 className="text-sm sm:text-base md:text-xl lg:text-lg font-bold truncate">
        {title} {/* Judul bisa berbeda tiap halaman */}
      </h1>

      {/* Kanan - Profile */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Avatar
          style={{
            backgroundColor: hover ? '#b7dcfa' : '#ffffff',
            color: '#1677ff',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
          className="text-xs sm:text-sm md:text-base lg:text-lg"
          size={{ xs: 25, md: 35 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => console.log('Avatar clicked!')}
        >
          {getInitial(username)}
        </Avatar>

        <span className="hidden sm:inline text-xs sm:text-sm md:text-base">
          {username}
        </span>
      </div>
    </div>
  );
}

export default Header;