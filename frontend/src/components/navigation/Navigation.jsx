import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import {
  IconHome,
  IconSearch,
  IconBuilding,
  IconUser,
  IconMessage,
  IconSettings,
  IconLogout
} from '@tabler/icons-react'
import useAuthStore from '@/store/authStore'

const Navigation = () => {
  const { user, isAuthenticated, activeRole, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  // Common navigation items
  const commonItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "Search",
      icon: <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/search",
    }
  ]

  // Role-specific navigation items
  const getRoleSpecificItems = () => {
    const items = []

    if (isAuthenticated) {
      // Add role-specific items
      if (activeRole === 'landlord' || user?.roles?.includes('landlord')) {
        items.push({
          title: "My Properties",
          icon: <IconBuilding className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "/dashboard/landlord",
        })
      }

      if (activeRole === 'tenant' || user?.roles?.includes('tenant')) {
        items.push({
          title: "My Rentals",
          icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "/dashboard/tenant",
        })
      }

      // Common authenticated user items
      items.push(
        {
          title: "Messages",
          icon: <IconMessage className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "/messages",
        },
        {
          title: "Profile",
          icon: user?.personalInfo?.profilePicture ? (
            <img
              src={user.personalInfo.profilePicture}
              width={20}
              height={20}
              alt="Profile"
              className="rounded-full"
            />
          ) : (
            <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          href: "/profile",
        },
        {
          title: "Settings",
          icon: <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "/settings",
        },
        {
          title: "Logout",
          icon: <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "#",
          onClick: handleLogout
        }
      )
    } else {
      // Non-authenticated user items
      items.push(
        {
          title: "Login",
          icon: <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: "/login",
        }
      )
    }

    return items
  }

  const allItems = [...commonItems, ...getRoleSpecificItems()]

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock
        items={allItems}
        desktopClassName="bg-white/95 backdrop-blur-md border-2 border-black/20 shadow-xl dark:bg-black/95 dark:border-white/20"
        mobileClassName="bg-white/95 backdrop-blur-md border-2 border-black/20 shadow-xl dark:bg-black/95 dark:border-white/20"
      />
    </div>
  )
}

export default Navigation