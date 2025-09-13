import React from 'react';
import useAuthStore from '../../store/authStore';

const AuthDebug = () => {
  const { user, token, isAuthenticated, activeRole, clearAuth, initializeAuth } = useAuthStore();

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const fixAuthState = () => {
    initializeAuth();
  };

  const forceLogout = () => {
    clearAuth();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Auth Debug Panel</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Auth State:</h3>
        <div className="bg-white p-4 rounded border">
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user?.email || 'None'}</p>
          <p><strong>Active Role:</strong> {activeRole}</p>
          <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
          <p><strong>User Roles:</strong> {user?.roles?.join(', ') || 'None'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={clearLocalStorage}
          className="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear All Local Storage & Reload
        </button>
        
        <button
          onClick={fixAuthState}
          className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fix Auth State Consistency
        </button>
        
        <button
          onClick={forceLogout}
          className="block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Force Logout (Keep in Same Page)
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
