import React from 'react';
import { LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const LogoutButton = () => {
  const { logout } = useAuthStore();

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Desktop logout button clicked!');
    
    logout();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        zIndex: 9999,
        position: 'relative',
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
