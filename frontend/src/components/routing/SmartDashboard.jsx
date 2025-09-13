import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../services/api';

const SmartDashboard = () => {
  const { user, activeRole, isAuthenticated, token, setUser, initializeAuth } = useAuthStore();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState('');
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);  useEffect(() => {
    console.log('🔍 SmartDashboard: useEffect triggered');
    console.log('📊 Auth state:', { isAuthenticated, user: user?.email, activeRole, userRoles: user?.roles, hasToken: !!token });
      setDebugInfo(`Auth: ${isAuthenticated}, User: ${user?.email || 'none'}, Role: ${activeRole || 'none'}, Token: ${!!token}`);

    // First, validate and fix any inconsistent auth state
    const isValidAuth = initializeAuth();
    if (!isValidAuth) {
      console.log('❌ Invalid auth state detected and cleared, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // If authenticated with token but no user data, fetch user data
    if (isAuthenticated && token && !user && !isLoadingUserData) {
      console.log('🔄 User authenticated with token but no user data, fetching...');
      setIsLoadingUserData(true);
      
      authAPI.getMe()
        .then(response => {
          if (response.data.success) {
            console.log('✅ User data fetched successfully:', response.data.data.user);
            setUser(response.data.data.user, token);
          } else {
            console.log('❌ Failed to fetch user data:', response.data.message);
            navigate('/login', { replace: true });
          }
        })
        .catch(error => {
          console.error('❌ Error fetching user data:', error);
          navigate('/login', { replace: true });
        })
        .finally(() => {
          setIsLoadingUserData(false);
        });
      return;
    }

    // If authenticated but no user data and no token, redirect to login
    if (isAuthenticated && !token && !user) {
      console.log('❌ Authenticated state but no token or user data, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // If authenticated but no user data yet, wait a bit
    if (!user && !isLoadingUserData) {
      console.log('⏳ User authenticated but no user data yet, waiting...');
      // Set a shorter timeout for this case
      setTimeout(() => {
        if (!user) {
          console.log('🚨 User data still not available, redirecting to seeker dashboard');
          navigate('/dashboard/seeker', { replace: true });
        }
      }, 2000);
      return;
    }

    // Skip routing if we're currently loading user data
    if (isLoadingUserData) {
      console.log('⏳ Loading user data, waiting...');
      return;
    }

    // Progressive role detection based on user's roles and active role
    const userRoles = user?.roles || [];
    const currentActiveRole = activeRole || user?.activeRole;
    
    console.log('🎯 Role detection:', { userRoles, currentActiveRole });

    // Priority-based role detection
    if (currentActiveRole && userRoles.includes(currentActiveRole)) {
      console.log(`✅ User has active role: ${currentActiveRole}`);
      // User has an active role set, redirect to that dashboard
      switch (currentActiveRole) {
        case 'landlord':
          console.log('🏠 Redirecting to landlord dashboard');
          navigate('/dashboard/landlord', { replace: true });
          break;
        case 'tenant':
          console.log('🏘️ Redirecting to tenant dashboard');
          navigate('/dashboard/tenant', { replace: true });
          break;
        case 'seeker':
        case 'propertySeeker':
          console.log('🔍 Redirecting to seeker dashboard');
          navigate('/dashboard/seeker', { replace: true });
          break;        case 'commonUser':
        default:
          console.log(`🤔 CommonUser or unknown active role: ${currentActiveRole}, falling back to role detection`);
          // If role is commonUser or unknown, detect based on available roles
          redirectBasedOnAvailableRoles(userRoles);
      }
    } else {
      console.log('🔄 No active role or role not in user roles, detecting based on available roles');
      // No active role set, detect based on available roles
      redirectBasedOnAvailableRoles(userRoles);
    }
  }, [isAuthenticated, user, activeRole, token, navigate, isLoadingUserData, initializeAuth]);

  // Timeout fallback - if stuck loading for more than 5 seconds, redirect to seeker
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout reached, redirecting to seeker dashboard as fallback');
      navigate('/dashboard/seeker', { replace: true });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const redirectBasedOnAvailableRoles = (userRoles) => {
    console.log('🎲 Detecting role based on available roles:', userRoles);
    
    if (userRoles.length === 0) {
      console.log('👤 New user with no roles, redirecting to seeker dashboard');
      // New user with no roles, redirect to seeker dashboard (default experience)
      console.log('🚀 REDIRECTING TO: /dashboard/seeker');
      navigate('/dashboard/seeker', { replace: true });
      return;
    }

    // Priority order: tenant > landlord > seeker
    if (userRoles.includes('tenant')) {
      console.log('🏘️ User has tenant role, redirecting to tenant dashboard');
      console.log('🚀 REDIRECTING TO: /dashboard/tenant');
      navigate('/dashboard/tenant', { replace: true });
    } else if (userRoles.includes('landlord')) {
      console.log('🏠 User has landlord role, redirecting to landlord dashboard');
      console.log('🚀 REDIRECTING TO: /dashboard/landlord');
      navigate('/dashboard/landlord', { replace: true });
    } else if (userRoles.includes('seeker') || userRoles.includes('propertySeeker')) {
      console.log('🔍 User has seeker role, redirecting to seeker dashboard');
      console.log('🚀 REDIRECTING TO: /dashboard/seeker');
      navigate('/dashboard/seeker', { replace: true });
    } else {
      console.log('🎯 Fallback to seeker dashboard for roles:', userRoles);
      // Fallback to seeker dashboard for any other case
      console.log('🚀 REDIRECTING TO: /dashboard/seeker (FALLBACK)');
      navigate('/dashboard/seeker', { replace: true });
    }
  };// Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoadingUserData ? 'Loading your profile...' : 'Loading your dashboard...'}
        </p>
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <p>Debug: {debugInfo}</p>
            <p>Loading user data: {isLoadingUserData ? 'Yes' : 'No'}</p>
            <p>Will redirect in 5 seconds if stuck...</p>
          </div>
        )}
        {/* Manual fallback buttons - only show if not currently loading user data */}
        {!isLoadingUserData && (
          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate('/dashboard/seeker', { replace: true })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Property Search
            </button>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDashboard;
