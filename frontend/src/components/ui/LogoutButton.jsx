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

  const handleLogout = () => {
    if (confirmLogout) {
      const confirmAction = window.confirm('Are you sure you want to logout?')
      if (!confirmAction) return
    }

    // Clear any stored data
    localStorage.removeItem('preferredCity')
    localStorage.removeItem('authToken')
    
    // Call logout from auth store
    logout()
    
    // Redirect to home page
    window.location.href = '/'
  }

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {showText && 'Logout'}
    </Button>
  )
}

export default LogoutButton
