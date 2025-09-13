import React from 'react';

const NavbarLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/rent-logo.png"
        alt="RentMate Logo"
        className="h-8 w-auto object-contain"
      />
      <div className="flex items-center">
        <span className="text-xl font-bold text-gray-900 dark:text-white">Rent</span>
        <span className="text-xl font-bold text-blue-500">Mate</span>
      </div>
    </div>
  );
};

export default NavbarLogo;
