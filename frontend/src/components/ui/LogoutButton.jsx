import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/authStore'

const LogoutButton = ({ 
  variant = "outline", 
  size = "default", 
  className = "",
  showIcon = true,
  showText = true,
  confirmLogout = true
}) => {
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    if (confirmLogout) {
      const confirmAction = window.confirm('Are you sure you want to logout?')
      if (!confirmAction) return
    }

    try {
      // Clear any stored data
      localStorage.removeItem('preferredCity')
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('rentmate-auth')
      
      // Call logout from auth store
      logout()
      
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      logout()
      window.location.href = '/'
    }
  }

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 ${className}`}
      style={{
        borderColor: '#fca5a5',
        color: '#dc2626'
      }}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {showText && 'Logout'}
    </Button>
  )
}

export default LogoutButton
