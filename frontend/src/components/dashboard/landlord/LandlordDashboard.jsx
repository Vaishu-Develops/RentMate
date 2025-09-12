import React, { useState, useEffect } from 'react'
import useAuthStore from '../../../store/authStore'

const LandlordDashboard = () => {
  const { user } = useAuthStore()
  const [dashboardData, setDashboardData] = useState({
    properties: [],
    applications: [],
    revenue: 0,
    occupancyRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch landlord dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Placeholder for API call
        // const response = await api.get('/landlord/dashboard')
        // setDashboardData(response.data)
        
        // Mock data for now
        setTimeout(() => {
          setDashboardData({
            properties: [],
            applications: [],
            revenue: 0,
            occupancyRate: 0
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.personalInfo?.name || 'Landlord'}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your properties and track your rental business
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Properties"
            value={dashboardData.properties.length}
            icon="🏢"
            color="bg-blue-500"
          />
          <StatCard
            title="Pending Applications"
            value={dashboardData.applications.length}
            icon="📋"
            color="bg-yellow-500"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${dashboardData.revenue.toLocaleString()}`}
            icon="💰"
            color="bg-green-500"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${dashboardData.occupancyRate}%`}
            icon="📊"
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* Properties Overview */}
        <PropertiesOverview properties={dashboardData.properties} />
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} rounded-full p-3 text-white text-xl`}>
        {icon}
      </div>
    </div>
  </div>
)

// Quick Actions Component
const QuickActions = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="space-y-3">
      <ActionButton
        text="Add New Property"
        href="/list-property"
        color="bg-blue-600 hover:bg-blue-700"
      />
      <ActionButton
        text="View Applications"
        href="/applications"
        color="bg-green-600 hover:bg-green-700"
      />
      <ActionButton
        text="Manage Tenants"
        href="/tenants"
        color="bg-purple-600 hover:bg-purple-700"
      />
      <ActionButton
        text="Financial Reports"
        href="/reports"
        color="bg-yellow-600 hover:bg-yellow-700"
      />
    </div>
  </div>
)

// Action Button Component
const ActionButton = ({ text, href, color }) => (
  <a
    href={href}
    className={`${color} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 block text-center`}
  >
    {text}
  </a>
)

// Recent Activity Component
const RecentActivity = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      <ActivityItem
        text="New application received for Property #123"
        time="2 hours ago"
        type="application"
      />
      <ActivityItem
        text="Rent payment received from John Doe"
        time="5 hours ago"
        type="payment"
      />
      <ActivityItem
        text="Maintenance request submitted"
        time="1 day ago"
        type="maintenance"
      />
      <ActivityItem
        text="Property #456 listing updated"
        time="2 days ago"
        type="property"
      />
    </div>
  </div>
)

// Activity Item Component
const ActivityItem = ({ text, time, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'application': return '📋'
      case 'payment': return '💰'
      case 'maintenance': return '🔧'
      case 'property': return '🏢'
      default: return '📝'
    }
  }

  return (
    <div className="flex items-start space-x-3 py-2">
      <span className="text-lg">{getIcon()}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{text}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

// Properties Overview Component
const PropertiesOverview = ({ properties }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Properties</h3>
      <a
        href="/properties"
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View All
      </a>
    </div>
    
    {properties.length === 0 ? (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🏢</div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h4>
        <p className="text-gray-600 mb-4">
          Start by adding your first property to begin managing your rental business.
        </p>
        <a
          href="/list-property"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Add Your First Property
        </a>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    )}
  </div>
)

// Property Card Component (placeholder)
const PropertyCard = ({ property }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <h4 className="font-medium text-gray-900">{property.title}</h4>
    <p className="text-gray-600 text-sm">{property.location}</p>
    <p className="text-green-600 font-semibold">₹{property.rent}/month</p>
  </div>
)

export default LandlordDashboard