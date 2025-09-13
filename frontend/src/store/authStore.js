import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      activeRole: 'commonUser',
      
      // Initialize auth state and validate consistency
      initializeAuth: () => {
        const { user, token, isAuthenticated } = get()
        
        // If authenticated but missing user or token, clear the auth state
        if (isAuthenticated && (!user || !token)) {
          console.log('🧹 Clearing inconsistent auth state')
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            activeRole: 'commonUser'
          })
          return false
        }
        
        // If we have token and user, ensure authenticated flag is set
        if (user && token && !isAuthenticated) {
          console.log('🔧 Fixing authenticated flag')
          set({ isAuthenticated: true })
          return true
        }
        
        return isAuthenticated
      },
      
      // Progressive role detection
      setUser: (user, token) => {
        console.log('🔐 Setting user in auth store:', { user: user?.email, hasToken: !!token })
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          activeRole: user?.activeRole || user?.roles?.[0] || 'commonUser'
        })
      },      
      logout: () => {
        console.log('🚪 Logging out and clearing auth state')
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          activeRole: 'commonUser'
        })
      },

      // Clear auth state (for fixing inconsistent states)
      clearAuth: () => {
        console.log('🧹 Clearing authentication state')
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          activeRole: 'commonUser'
        })
      },
      
      // Add role to user based on actions
      addRole: (role) => {
        const { user } = get()
        if (user && !user.roles.includes(role)) {
          const updatedUser = {
            ...user,
            roles: [...user.roles, role]
          }
          set({ user: updatedUser })
          return updatedUser
        }
        return user
      },
        // Switch active role
      switchRole: async (role) => {
        const { user, token } = get()
        if (user && user.roles.includes(role)) {
          try {
            const response = await fetch('/api/auth/switch-role', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ role })
            })

            if (response.ok) {
              const updatedUser = { ...user, activeRole: role }
              set({ user: updatedUser, activeRole: role })
              return updatedUser
            } else {
              throw new Error('Failed to switch role')
            }
          } catch (error) {
            console.error('Role switch error:', error)
            // Fallback to local update if API fails
            const updatedUser = { ...user, activeRole: role }
            set({ user: updatedUser, activeRole: role })
            return updatedUser
          }
        }
      },
        // Update user profile
      updateUser: (updates) => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, ...updates }
          set({ user: updatedUser })
          return updatedUser
        }
      },

      // Update user profile with API call
      updateProfile: async (profileData) => {
        const { token, user } = get()
        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          })

          if (response.ok) {
            const updatedUser = await response.json()
            set({ 
              user: { 
                ...user, 
                personalInfo: { ...user.personalInfo, ...profileData } 
              } 
            })
            return updatedUser
          } else {
            throw new Error('Failed to update profile')
          }
        } catch (error) {
          console.error('Profile update error:', error)
          throw error
        }
      },
      
      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get()
        return user?.roles?.includes(role) || false
      },
      
      // Get user permissions based on active role
      getPermissions: () => {
        const { activeRole } = get()
        const permissions = {
          commonUser: ['search', 'view', 'apply'],
          tenant: ['search', 'view', 'apply', 'pay_rent', 'maintenance_request', 'view_lease'],
          landlord: ['list_property', 'manage_properties', 'review_applications', 'collect_rent', 'manage_maintenance']
        }
        return permissions[activeRole] || permissions.commonUser
      }
    }),
    {
      name: 'rentmate-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole
      })
    }
  )
)

export default useAuthStore