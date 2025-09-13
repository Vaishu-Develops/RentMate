import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  NavbarLogo, 
  NavbarButton, 
  MobileNavHeader, 
  MobileNavToggle, 
  MobileNavMenu 
} from '@/components/ui/resizable-navbar'
import LogoutButton from '@/components/ui/LogoutButton'
import { Search, MapPin, Home, Heart, Eye, MessageCircle, Bell, User, Settings, Filter, TrendingUp, AlertCircle, Users, LayoutDashboard } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import aiService from '@/services/aiService'
import ThreeDPropertyCard from '@/components/ui/3d-property-card'
import ThreeDRecommendationCard from '@/components/ui/3d-recommendation-card'

const UnifiedHomePage = () => {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedBHK, setSelectedBHK] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [activityInsights, setActivityInsights] = useState(null)
  const [naturalSearchQuery, setNaturalSearchQuery] = useState('')

  // Handle search functionality
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('location', searchQuery)
    if (selectedBudget) params.append('budget', selectedBudget)
    if (selectedBHK) params.append('bhk', selectedBHK)
    
    window.location.href = `/search?${params.toString()}`
  }

  // Handle Near Me functionality
  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          window.location.href = `/search?lat=${latitude}&lng=${longitude}`
        },
        (error) => {
          alert('Unable to get your location. Please search manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  // Handle property card click
  const handlePropertyClick = (propertyId) => {
    window.location.href = `/property/${propertyId}`
  }

  // Handle View All Properties
  const handleViewAllProperties = () => {
    window.location.href = '/search'
  }

  // Handle Filter by Location
  const handleFilterByLocation = () => {
    window.location.href = '/search?filter=location'
  }

  // Handle Natural Language Search
  const handleNaturalSearch = async () => {
    if (!naturalSearchQuery.trim()) return
    
    try {
      const filters = await aiService.processNaturalLanguageSearch(naturalSearchQuery)
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      window.location.href = `/search?${params.toString()}`
    } catch (error) {
      // Fallback to regular search
      window.location.href = `/search?q=${encodeURIComponent(naturalSearchQuery)}`
    }
  }

  // Generate AI suggestions based on user behavior
  const generateAISuggestions = async () => {
    const userBehavior = {
      searchHistory: ['RS Puram', 'Gandhipuram', 'IT Park'],
      viewedProperties: 8,
      savedProperties: 3,
      messagesSent: 2,
      timeSpent: '15 minutes',
      preferredBudget: selectedBudget,
      preferredBHK: selectedBHK
    }

    try {
      const suggestions = await aiService.generateRoleSuggestions(userBehavior)
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
    }
  }

  // Generate activity insights
  const generateActivityInsights = async () => {
    const recentActivity = [
      { action: 'viewed_property', details: '2BHK in Gandhipuram', time: '2 hours ago' },
      { action: 'saved_properties', count: 3, time: '5 hours ago' },
      { action: 'received_message', from: 'property_owner', time: '1 day ago' }
    ]

    try {
      const insights = await aiService.generateActivityInsights(recentActivity)
      setActivityInsights(insights)
    } catch (error) {
      console.error('Failed to generate activity insights:', error)
    }
  }

  // Load AI suggestions on component mount
  useEffect(() => {
    generateAISuggestions()
    generateActivityInsights()
  }, [selectedBudget, selectedBHK])

  const budgetFilters = [
    { label: '₹10k-20k', value: '10000-20000' },
    { label: '₹20k-30k', value: '20000-30000' },
    { label: '₹30k-50k', value: '30000-50000' },
    { label: '50k+', value: '50000-999999' },
    { label: 'All Budgets', value: '' }
  ]

  const bhkFilters = [
    { label: '1BHK', value: '1bhk' },
    { label: '2BHK', value: '2bhk' },
    { label: '3BHK', value: '3bhk' },
    { label: '4BHK+', value: '4bhk+' },
    { label: 'All Types', value: '' }
  ]

  const featuredProperties = [
    {
      id: 1,
      price: 18000,
      maintenance: 2000,
      type: '2BHK',
      area: 950,
      location: 'RS Puram',
      distance: '2.5km from Railway Station',
      verified: true,
      responseTime: '2 hours',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      price: 25000,
      maintenance: 3000,
      type: '3BHK',
      area: 1200,
      location: 'Gandhipuram',
      distance: '1km from Metro Station',
      verified: true,
      responseTime: '1 hour',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      price: 15000,
      maintenance: 1500,
      type: '1BHK',
      area: 650,
      location: 'Saibaba Colony',
      distance: '3km from IT Park',
      verified: true,
      responseTime: '3 hours',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop'
    }
  ]

  const recentActivity = [
    { action: 'You viewed 2BHK in Gandhipuram', time: '2 hours ago' },
    { action: 'You saved 3 properties to your favorites', time: '5 hours ago' },
    { action: 'New property matches your search criteria', time: '1 day ago' },
    { action: 'You received a message from Rajesh Kumar', time: '2 days ago' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-thistle-50 to-muted">
      {/* Navigation Bar - Using ResizableNavbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo />          <NavItems items={[
            { name: "Home", link: "/" },
            { name: "Dashboard", link: "/dashboard" },
            { name: "Messages", link: "/messages" },
            { name: "My Activity", link: "/activity" },
            { name: "Notifications", link: "/notifications" }
          ]} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" href="/profile">
              Profile
            </NavbarButton>
            <LogoutButton variant="outline" size="sm" />
          </div>
        </NavBody>
        
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >            {[
              { name: "Home", link: "/" },
              { name: "Dashboard", link: "/dashboard" },
              { name: "Messages", link: "/messages" },
              { name: "My Activity", link: "/activity" },
              { name: "Notifications", link: "/notifications" }
            ].map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <LogoutButton 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 hover:bg-red-50"
                confirmLogout={false}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
        {/* Welcome Section - Moved inside container */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Good morning, {user?.personalInfo?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg mb-8">Ready to explore rental opportunities?</p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="flex items-center space-x-2 px-6 py-3"
              onClick={() => window.location.href = '/list-property'}
            >
              <Home className="w-5 h-5" />
              <span>List Your Property</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 px-6 py-3"
              onClick={() => window.location.href = '/messages'}
            >
              <MessageCircle className="w-5 h-5" />
              <span>View Messages</span>
            </Button>
          </div>
        </motion.section>

        {/* Natural Language Search Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-[#B399D4]/20 bg-gradient-to-r from-[#B399D4]/5 to-[#A085C4]/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#B399D4]/20 rounded-full">
                  <TrendingUp className="w-5 h-5 text-[#B399D4]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Smart Search</h3>
                  <p className="text-sm text-gray-600">Describe what you're looking for in natural language</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Try: '2BHK near IT parks under 25k' or 'Pet-friendly apartments with parking'"
                    value={naturalSearchQuery}
                    onChange={(e) => setNaturalSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNaturalSearch()}
                    className="h-12 text-base"
                  />
                  <Button 
                    onClick={handleNaturalSearch}
                    className="absolute right-2 top-2 h-8"
                    size="sm"
                  >
                    Search
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[
                    "2BHK near IT parks under 25k",
                    "Family-friendly apartments with parking", 
                    "Pet-friendly houses in safe neighborhoods",
                    "Furnished studio near metro station"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setNaturalSearchQuery(example)}
                      className="px-3 py-1 text-xs bg-[#B399D4]/10 text-[#B399D4] rounded-full hover:bg-[#B399D4]/20 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Property Search Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-4">
                  Where would you like to live?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by area, landmark, or builder..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 h-12"
                    />
                  </div>
                  <Button 
                    className="flex items-center space-x-2 h-12"
                    onClick={handleNearMe}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Near Me</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-3">Quick Filters:</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {budgetFilters.slice(0, 4).map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedBudget === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBudget(filter.value)}
                        className="text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bhkFilters.slice(0, 4).map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedBHK === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBHK(filter.value)}
                        className="text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleSearch}
                  className="flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t pt-4 mt-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Furnishing</label>
                      <select className="w-full p-2 border rounded">
                        <option>Any</option>
                        <option>Furnished</option>
                        <option>Semi-Furnished</option>
                        <option>Unfurnished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type</label>
                      <select className="w-full p-2 border rounded">
                        <option>Any</option>
                        <option>Apartment</option>
                        <option>Independent House</option>
                        <option>Villa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Parking</label>
                      <select className="w-full p-2 border rounded">
                        <option>Any</option>
                        <option>Car Parking</option>
                        <option>Bike Parking</option>
                        <option>Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Amenities</label>
                      <select className="w-full p-2 border rounded">
                        <option>Any</option>
                        <option>Gym</option>
                        <option>Swimming Pool</option>
                        <option>Security</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Featured Properties Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Featured Properties</h2>
            <p className="text-gray-600">Discover quality rentals in your preferred locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <ThreeDPropertyCard
                key={property.id}
                property={property}
                onPropertyClick={handlePropertyClick}
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <Button onClick={handleViewAllProperties}>View All Properties</Button>
            <Button variant="outline" onClick={handleFilterByLocation}>Filter by Location</Button>
          </div>
        </motion.section>

        {/* Progressive Role Detection Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-[#E3C0D5]/30 bg-gradient-to-r from-[#E3C0D5]/10 to-[#E3C0D5]/5">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-[#81D4BB]/20 rounded-full">
                  <Users className="w-5 h-5 text-[#81D4BB]" />
                </div>
                Based on Your Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Landlord Interest */}
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-3xl mb-3 text-[#81D4BB]">🏠</div>
                  <h4 className="font-medium text-gray-800 mb-3">Interested in listing a property?</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-[#81D4BB] hover:text-[#6BB8A6] p-0 h-auto"
                      onClick={() => window.location.href = '/landlord/benefits'}
                    >
                      Learn about listing benefits
                    </Button>
                    <br />
                    <Button 
                      size="sm"
                      className="bg-[#B5D0D9] hover:bg-[#A5C0C9] text-gray-800"
                      onClick={() => window.location.href = '/list-property'}
                    >
                      Start listing
                    </Button>
                  </div>
                </div>

                {/* Tenant Interest */}
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-3xl mb-3 text-[#81D4BB]">🔍</div>
                  <h4 className="font-medium text-gray-800 mb-3">Looking for your next home?</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-[#81D4BB] hover:text-[#6BB8A6] p-0 h-auto"
                      onClick={() => window.location.href = '/tenant/preferences'}
                    >
                      Save search preferences
                    </Button>
                    <br />
                    <Button 
                      size="sm"
                      className="bg-[#B5D0D9] hover:bg-[#A5C0C9] text-gray-800"
                      onClick={() => window.location.href = '/alerts/setup'}
                    >
                      Set up alerts
                    </Button>
                  </div>
                </div>

                {/* Communication Interest */}
                <div className="text-center p-4 rounded-lg bg-white/50">
                  <div className="text-3xl mb-3 text-[#81D4BB]">💬</div>
                  <h4 className="font-medium text-gray-800 mb-3">Want to connect with property owners?</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-[#81D4BB] hover:text-[#6BB8A6] p-0 h-auto"
                      onClick={() => window.location.href = '/communication/tips'}
                    >
                      See communication tips
                    </Button>
                    <br />
                    <Button 
                      size="sm"
                      className="bg-[#B5D0D9] hover:bg-[#A5C0C9] text-gray-800"
                      onClick={() => window.location.href = '/messages'}
                    >
                      View your messages
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI-Powered Suggestions */}
              {aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#81D4BB]/10 rounded-lg border border-[#81D4BB]/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#81D4BB]" />
                    <span className="text-sm font-medium text-gray-800">AI Insights</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Based on your activity, you seem to be <span className="font-medium text-[#B399D4]">{aiSuggestions.role_likelihood}</span>
                  </p>
                  <div className="space-y-1">
                    {aiSuggestions.suggestions?.map((suggestion, index) => (
                      <p key={index} className="text-xs text-gray-600">• {suggestion}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Enhanced Recent Activity Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-[#B399D4]/20 rounded-full">
                  <Eye className="w-5 h-5 text-[#B399D4]" />
                </div>
                What's Happening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recent Activity Items */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#B399D4] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">You viewed 2BHK in Gandhipuram</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#81D4BB] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">You saved 3 properties to your favorites</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#E3C0D5] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">New property matches your search criteria</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#B399D4] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">You received a message from Rajesh Kumar</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>

                {/* AI Activity Insights */}
                {activityInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-[#81D4BB]/10 to-[#B399D4]/10 rounded-lg border border-[#81D4BB]/20"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-[#81D4BB]" />
                      <span className="text-sm font-medium text-gray-800">Smart Insights</span>
                    </div>
                    <div className="space-y-2">
                      {activityInsights.map((insight, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-gray-700 font-medium">{insight.insight}</p>
                          <p className="text-xs text-gray-600 mt-1">💡 {insight.action}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={() => window.location.href = '/messages'}>View Messages</Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/activity'}
                >
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Tools & Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Tools & Resources</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '📄', name: 'Rental Calculator', action: () => window.location.href = '/tools/calculator' },
              { icon: '🏛', name: 'Legal Templates', action: () => window.location.href = '/tools/legal' },
              { icon: '📊', name: 'Area Insights', action: () => window.location.href = '/tools/insights' },
              { icon: '🛡', name: 'Verification Guide', action: () => window.location.href = '/tools/verification' },
              { icon: '📞', name: 'Customer Support', action: () => window.location.href = '/support' },
              { icon: '❓', name: 'How-to Guides', action: () => window.location.href = '/guides' }
            ].map((tool, index) => (
              <Card 
                key={index} 
                className="border-2 border-gray-200 hover:border-[#B399D4] transition-colors cursor-pointer"
                onClick={tool.action}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2 text-[#B399D4]">{tool.icon}</div>
                  <p className="text-sm font-medium text-gray-800">{tool.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Smart Recommendations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 border-[#81D4BB]/20 bg-gradient-to-r from-[#81D4BB]/5 to-[#B399D4]/5">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-[#81D4BB]/20 rounded-full">
                  <TrendingUp className="w-5 h-5 text-[#81D4BB]" />
                </div>
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Drop Alerts */}
                <ThreeDRecommendationCard
                  icon="📉"
                  title="Price Drop Alert"
                  description="2BHK in RS Puram dropped by ₹2,000"
                  buttonText="View Property"
                  onClick={() => window.location.href = '/property/123'}
                  variant="default"
                />

                {/* Similar Properties */}
                <ThreeDRecommendationCard
                  icon="🏘️"
                  title="Similar Properties"
                  description="3 new properties match your preferences"
                  buttonText="Explore Similar"
                  onClick={() => window.location.href = '/search?similar=true'}
                  variant="tiffany"
                />

                {/* Optimal Timing */}
                <ThreeDRecommendationCard
                  icon="⏰"
                  title="Best Time to Search"
                  description="Most properties are listed on weekends"
                  buttonText="Learn More"
                  onClick={() => window.location.href = '/insights/timing'}
                  variant="thistle"
                />

                {/* Trending Areas */}
                <ThreeDRecommendationCard
                  icon="📍"
                  title="Trending Areas"
                  description="Saibaba Colony is gaining popularity"
                  buttonText="Explore Area"
                  onClick={() => window.location.href = '/search?area=saibaba-colony'}
                  variant="columbia"
                />
              </div>

              {/* AI-Powered Insights */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#B399D4]/10 to-[#81D4BB]/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-[#B399D4] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">AI-Powered Insights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-[#81D4BB]">🎯</span>
                    <p className="text-gray-700">Based on your searches, you prefer properties near IT hubs with good connectivity</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#B399D4]">💰</span>
                    <p className="text-gray-700">Your budget range aligns with 78% of available properties in your preferred areas</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#E3C0D5]">📊</span>
                    <p className="text-gray-700">Properties you viewed have 15% faster response rates than average</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#B5D0D9]">⭐</span>
                    <p className="text-gray-700">Consider expanding your search radius by 2km for 40% more options</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

export default UnifiedHomePage