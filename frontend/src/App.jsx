import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuthStore from './store/authStore'
import Navigation from './components/navigation/Navigation'
import HomePage from './components/home/HomePage'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import LandlordDashboard from './components/dashboard/landlord/LandlordDashboard'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, activeRole } = useAuthStore()
  
  if (isAuthenticated) {
    // Redirect based on active role
    if (activeRole === 'landlord') {
      return <Navigate to="/dashboard/landlord" replace />
    } else if (activeRole === 'tenant') {
      return <Navigate to="/dashboard/tenant" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }
  
  return children
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterForm />
                </PublicRoute>
              } 
            />

            {/* Search Routes */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Landlord Routes */}
            <Route 
              path="/dashboard/landlord" 
              element={
                <ProtectedRoute requiredRole="landlord">
                  <LandlordDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/list-property" 
              element={
                <ProtectedRoute>
                  <ListPropertyPage />
                </ProtectedRoute>
              } 
            />

            {/* Tenant Routes */}
            <Route 
              path="/dashboard/tenant" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <TenantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/:propertyId" 
              element={
                <ProtectedRoute>
                  <ApplicationPage />
                </ProtectedRoute>
              } 
            />

            {/* Common Protected Routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />

            {/* Payment Routes */}
            <Route 
              path="/payment/rent/:leaseId" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <RentPaymentPage />
                </ProtectedRoute>
              } 
            />

            {/* Maintenance Routes */}
            <Route 
              path="/maintenance/new" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <MaintenanceRequestPage />
                </ProtectedRoute>
              } 
            />

            {/* Legal Routes */}
            <Route 
              path="/lease/generate/:applicationId" 
              element={
                <ProtectedRoute requiredRole="landlord">
                  <LeaseGenerationPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>


        </div>
      </Router>
    </QueryClientProvider>
  )
}

// Placeholder components for routes (to be implemented)
const SearchPage = () => <div className="min-h-screen pt-20 px-4">Search Page - Coming Soon</div>
const PropertyDetailPage = () => <div className="min-h-screen pt-20 px-4">Property Detail Page - Coming Soon</div>
const DashboardPage = () => <div className="min-h-screen pt-20 px-4">Dashboard - Coming Soon</div>
const TenantDashboard = () => <div className="min-h-screen pt-20 px-4">Tenant Dashboard - Coming Soon</div>
const ListPropertyPage = () => <div className="min-h-screen pt-20 px-4">List Property - Coming Soon</div>
const ApplicationPage = () => <div className="min-h-screen pt-20 px-4">Application Page - Coming Soon</div>
const MessagesPage = () => <div className="min-h-screen pt-20 px-4">Messages - Coming Soon</div>
const ProfilePage = () => <div className="min-h-screen pt-20 px-4">Profile - Coming Soon</div>
const SettingsPage = () => <div className="min-h-screen pt-20 px-4">Settings - Coming Soon</div>
const RentPaymentPage = () => <div className="min-h-screen pt-20 px-4">Rent Payment - Coming Soon</div>
const MaintenanceRequestPage = () => <div className="min-h-screen pt-20 px-4">Maintenance Request - Coming Soon</div>
const LeaseGenerationPage = () => <div className="min-h-screen pt-20 px-4">Lease Generation - Coming Soon</div>

export default App