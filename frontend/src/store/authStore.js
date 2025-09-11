import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      activeRole: 'commonUser',
      
      // Progressive role detection
      setUser: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        activeRole: user?.activeRole || user?.roles?.[0] || 'commonUser'
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        activeRole: 'commonUser'
      }),
      
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
      switchRole: (role) => {
        const { user } = get()
        if (user && user.roles.includes(role)) {
          const updatedUser = { ...user, activeRole: role }
          set({ user: updatedUser, activeRole: role })
          return updatedUser
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