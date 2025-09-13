import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const DashboardTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeRole, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    console.log('🧪 DashboardTest Component Loaded');
    console.log('📍 Current Location:', location.pathname);
    console.log('👤 Auth State:', {
      isAuthenticated,
      user: user?.email,
      activeRole,
      userRoles: user?.roles,
      hasToken: !!token
    });
  }, [location, user, activeRole, isAuthenticated, token]);

  const testNavigation = (path) => {
    console.log(`🔄 Testing navigation to: ${path}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Navigation Test</h1>
        
        {/* Current State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Current Path:</strong> {location.pathname}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User Email:</strong> {user?.email || 'None'}</p>
              <p><strong>User Name:</strong> {user?.personalInfo?.name || user?.name || 'None'}</p>
            </div>
            <div>
              <p><strong>Active Role:</strong> {activeRole || 'None'}</p>
              <p><strong>User Roles:</strong> {user?.roles?.join(', ') || 'None'}</p>
              <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => testNavigation('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Smart Dashboard
            </button>
            <button
              onClick={() => testNavigation('/dashboard/seeker')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Seeker Dashboard
            </button>
            <button
              onClick={() => testNavigation('/dashboard/tenant')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tenant Dashboard
            </button>
            <button
              onClick={() => testNavigation('/dashboard/landlord')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Landlord Dashboard
            </button>
            <button
              onClick={() => testNavigation('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Home Page
            </button>
            <button
              onClick={() => testNavigation('/profile')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Profile Page
            </button>
          </div>
        </div>

        {/* User Roles Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Available Roles:</h3>
              <div className="flex flex-wrap gap-2">
                {user?.roles?.map(role => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      role === activeRole 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                  >
                    {role}
                    {role === activeRole && ' (Active)'}
                  </span>
                )) || <span className="text-gray-500">No roles assigned</span>}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Expected Dashboard Routes:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>commonUser:</strong> → /dashboard/seeker (Property Search)</li>
                <li>• <strong>seeker:</strong> → /dashboard/seeker (Property Search)</li>
                <li>• <strong>tenant:</strong> → /dashboard/tenant (Tenant Dashboard)</li>
                <li>• <strong>landlord:</strong> → /dashboard/landlord (Landlord Dashboard)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTest;
