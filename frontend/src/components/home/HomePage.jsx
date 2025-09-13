import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackgroundDemo } from '@/components/ui/aurora-background-demo'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import LogoutButton from '@/components/ui/LogoutButton'
import AuthDebug from '@/components/debug/AuthDebug'
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
import { Search, MapPin, Home, Shield, CreditCard, Headphones, Star, Users, CheckCircle } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const HomePage = () => {
  const { isAuthenticated, user, activeRole } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { name: "How It Works", link: "#how-it-works" },
    { name: "Cities", link: "#cities" },
    { name: "Success Stories", link: "#testimonials" }
  ]
  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Search", link: "/search" },
    { name: "Messages", link: "/messages" }
  ]

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems

  // Trust-building features for non-authenticated users
  const trustFeatures = [
    {
      title: "Property Verification",
      description: "Every property physically verified for authenticity and legal compliance"
    },
    {
      title: "Secure Payments",
      description: "Digital rent collection with instant HRA receipts and secure transactions"
    },
    {
      title: "Legal Documentation",
      description: "Smart lease agreements and automated rent receipts for tax purposes"
    },
    {
      title: "24/7 Support",
      description: "Expert help when you need it with dedicated customer support team"
    },
    {
      title: "Direct Owner Contact",
      description: "Connect directly with property owners without any middlemen or brokers"
    },
    {
      title: "AI-Powered Matching",
      description: "Smart property recommendations based on your preferences and requirements"
    }
  ]

  // Cities for simple selection
  const availableCities = [
    "Coimbatore", "Chennai", "Bangalore", "Hyderabad", 
    "Mumbai", "Delhi", "Pune", "Kolkata"
  ]

  // Success stories for social proof
  const testimonials = [
    {
      quote: "Found my dream home in 3 days!",
      author: "Priya",
      role: "Software Engineer",
      rating: 5
    },
    {
      quote: "No broker fees saved me ₹25,000!",
      author: "Raj",
      role: "Marketing Manager", 
      rating: 5
    },
    {
      quote: "Landlords respond within hours",
      author: "Anita",
      role: "Teacher",
      rating: 5
    },
    {
      quote: "Smooth digital payments",
      author: "Kumar",
      role: "Doctor",
      rating: 5
    }
  ]



  const handleGetStarted = () => {
    window.location.href = '/register'
  }

  const handleListProperty = () => {
    if (isAuthenticated) {
      window.location.href = '/list-property'
    } else {
      window.location.href = '/register'
    }
  }

  const handleCitySelect = (city) => {
    if (isAuthenticated) {
      window.location.href = `/search?city=${city}`
    } else {
      // Store city preference and redirect to register
      localStorage.setItem('preferredCity', city)
      window.location.href = '/register'
    }
  }

  // Render different homepage based on authentication status
  if (!isAuthenticated) {
    // NON-AUTHENTICATED USER HOMEPAGE
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              <NavbarButton variant="secondary" href="/login">
                Login
              </NavbarButton>
              <NavbarButton variant="primary" href="/register">
                Sign Up
              </NavbarButton>
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
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full"
                  href="/login"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  href="/register"
                >
                  Sign Up
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>

        {/* Hero Section with Aurora Background */}
        <AuroraBackgroundDemo className="min-h-screen">
          <div className="text-3xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-raisin to-tiffany">
            Find Your Perfect Rental Home
          </div>
          <div className="font-extralight text-base md:text-4xl text-raisin py-4 text-center">
            India's Most Trusted Rental Platform
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-raisin/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-tiffany" />
              <span className="font-medium">50,000+ Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-tiffany" />
              <span className="font-medium">Direct Owner Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-tiffany" />
              <span className="font-medium">Zero Brokerage Options</span>
            </div>
          </div>

          {/* Primary CTA with Hover Border Gradient */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-black text-white flex items-center space-x-2 text-lg px-8 py-4 dark:bg-white dark:text-black"
              onClick={handleGetStarted}
            >
              <span>🏠</span>
              <span>Get Started - It's Free</span>
            </HoverBorderGradient>
          </div>

          {/* Secondary CTA */}
          <p className="text-black/80 dark:text-white/80 text-lg">
            Already have property to rent?{' '}
            <HoverBorderGradient
              containerClassName="rounded-full inline-block"
              as="button"
              className="bg-transparent border-2 border-black/30 text-black px-6 py-2 text-base dark:border-white/30 dark:text-white"
              onClick={handleListProperty}
            >
              List Now
            </HoverBorderGradient>
          </p>
        </AuroraBackgroundDemo>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                How RentMate Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  icon: "🔍",
                  title: "Discover",
                  description: "Browse verified properties in your city"
                },
                {
                  step: "2", 
                  icon: "💬",
                  title: "Connect",
                  description: "Chat directly with property owners"
                },
                {
                  step: "3",
                  icon: "🏠", 
                  title: "Move In",
                  description: "Complete paperwork digitally and move in hassle-free"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 dark:bg-white dark:text-black">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-black text-white flex items-center space-x-2 text-lg px-8 py-4 dark:bg-white dark:text-black"
                onClick={() => handleCitySelect('Coimbatore')}
              >
                <span>See Properties in Your City</span>
              </HoverBorderGradient>
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section id="cities" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                Available in Your City
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {availableCities.slice(0, 6).map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="px-6 py-3 bg-white hover:bg-black hover:text-white rounded-lg font-medium transition-colors border-2 border-black/10 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-black dark:border-white/10"
                >
                  {city}
                </button>
              ))}
              <button
                onClick={() => handleCitySelect('more')}
                className="px-6 py-3 bg-white hover:bg-black hover:text-white rounded-lg font-medium transition-colors border-2 border-black/10 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-black dark:border-white/10"
              >
                More Cities
              </button>
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400">
              Select your city to see available properties
            </p>
          </div>
        </section>

        {/* Trust Features */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                Why Choose RentMate?
              </h2>
            </motion.div>

            <HoverEffect items={trustFeatures} />

            <div className="text-center mt-12">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-black text-white flex items-center space-x-2 text-lg px-8 py-4 dark:bg-white dark:text-black"
                onClick={handleGetStarted}
              >
                <span>Join 100,000+ Happy Users</span>
              </HoverBorderGradient>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                What Our Users Say
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full">
                    <CardContent className="p-0">
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-black dark:text-white">- {testimonial.author}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-transparent border-2 border-black text-black flex items-center space-x-2 text-lg px-8 py-4 dark:border-white dark:text-white"
              >
                <span>Read More Success Stories</span>
              </HoverBorderGradient>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-black text-white dark:bg-white dark:text-black">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Home?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                No spam, no hidden fees, no complicated setup
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-white text-black hover:bg-gray-100 flex items-center space-x-2 text-lg px-8 py-4 dark:bg-black dark:text-white dark:hover:bg-gray-800"
                  onClick={handleGetStarted}
                >
                  <span>Create Free Account</span>
                </HoverBorderGradient>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-transparent border-2 border-white/30 text-white flex items-center space-x-2 text-lg px-8 py-4 dark:border-black/30 dark:text-black"
                  onClick={handleListProperty}
                >
                  <span>List Your Property</span>
                </HoverBorderGradient>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  // AUTHENTICATED USER HOMEPAGE
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation for authenticated users */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, {user?.personalInfo?.name}!
            </div>
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
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <LogoutButton 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 hover:bg-red-50"
                confirmLogout={false}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>      </Navbar>

      {/* Debug Panel - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AuthDebug />
        </div>
      )}

      {/* Personalized Header */}
      <section className="pt-32 pb-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Good morning, {user?.personalInfo?.name}! 👋
              </h1>
              <p className="text-gray-600">
                You're currently a: <span className="font-medium capitalize">{activeRole}</span>
                {user?.roles?.length > 1 && (
                  <button className="ml-2 text-primary hover:underline text-sm">
                    Switch Role
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Dashboard */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Search Properties</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm">Pay Rent</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Home className="w-6 h-6" />
                  <span className="text-sm">Report Issue</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Messages</span>
                </Button>
              </div>
              
              {/* User Account Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" href="/profile" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    View Profile
                  </Button>
                  <LogoutButton />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Personalized Search for authenticated users */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Find Your Next Home</h2>
              
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where do you want to live?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Area, Landmark, or Builder"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full md:w-48 h-10 px-3 border border-input rounded-md bg-background"
                  >
                    <option value="">Select Budget</option>
                    <option value="0-15000">Under ₹15k</option>
                    <option value="15000-25000">₹15k-₹25k</option>
                    <option value="25000-40000">₹25k-₹40k</option>
                    <option value="40000-999999">₹40k+</option>
                  </select>
                </div>

                <Button size="lg" className="w-full md:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </Button>
              </div>

              {/* Recent searches for authenticated users */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">Recent Searches: </span>
                <div className="inline-flex gap-2 mt-2">
                  {['RS Puram', 'Gandhipuram', 'Race Course'].map((search) => (
                    <button
                      key={search}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Role-specific content */}
      {activeRole === 'tenant' && (
        <section className="pb-8 px-4">
          <div className="container mx-auto">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Current Rental</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">2BHK Apartment, RS Puram</h3>
                  <p className="text-sm text-gray-600 mt-1">Next rent due: December 1, 2024 (3 days)</p>
                  <div className="flex gap-3 mt-4">
                    <Button size="sm">Pay Now ₹20,000</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Message Landlord</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeRole === 'landlord' && (
        <section className="pb-8 px-4">
          <div className="container mx-auto">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Property Portfolio</h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">This Month: ₹45,000 collected</h3>
                    <span className="text-sm text-orange-600">2 pending payments</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• New application for RS Puram property</p>
                    <p>• Maintenance request from Gandhipuram tenant</p>
                    <p>• Rent overdue: 1BHK Saibaba Colony (2 days)</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button size="sm">View All Properties</Button>
                    <Button size="sm" variant="outline">Review Applications</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage