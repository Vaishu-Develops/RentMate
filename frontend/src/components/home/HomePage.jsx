import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackgroundDemo } from '@/components/ui/aurora-background-demo'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import LogoutButton from '@/components/ui/LogoutButton'
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
import { 
  Search, 
  MapPin, 
  Home, 
  Shield, 
  CreditCard, 
  Headphones, 
  Star, 
  Users, 
  CheckCircle,
  Building2,
  MessageCircle,
  FileText,
  Clock,
  Zap,
  Award,
  Phone,
  Eye,
  Lock,
  DollarSign,
  TrendingUp,
  UserCheck,
  Heart,
  ArrowRight,
  PlayCircle
} from 'lucide-react'
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
    { name: "Dashboard", link: "/dashboard" },
    { name: "Search", link: "/search" },
    { name: "Messages", link: "/messages" }
  ]

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems

  // Trust-building features for non-authenticated users
  const trustFeatures = [
    {
      title: "Property Verification",
      description: "Every property physically verified for authenticity and legal compliance",
      icon: Shield
    },
    {
      title: "Secure Payments", 
      description: "Digital rent collection with instant HRA receipts and secure transactions",
      icon: Lock
    },
    {
      title: "Legal Documentation",
      description: "Smart lease agreements and automated rent receipts for tax purposes",
      icon: FileText
    },
    {
      title: "24/7 Support",
      description: "Expert help when you need it with dedicated customer support team",
      icon: Headphones
    },
    {
      title: "Direct Owner Contact",
      description: "Connect directly with property owners without any middlemen or brokers",
      icon: UserCheck
    },
    {
      title: "AI-Powered Matching",
      description: "Smart property recommendations based on your preferences and requirements",
      icon: Zap
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
        <AuroraBackgroundDemo className="min-h-screen flex flex-col justify-center items-center relative px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-600 dark:from-white dark:to-gray-400 leading-tight">
                Find Your Perfect Rental Home
              </h1>
              
              <p className="text-lg md:text-2xl text-black/80 dark:text-white/80 font-light max-w-2xl mx-auto">
                India's Most Trusted Rental Platform - Zero Brokerage, Verified Properties
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 py-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Building2 className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-medium text-black dark:text-white">50,000+ Verified Properties</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-medium text-black dark:text-white">Direct Owner Contact</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <DollarSign className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-medium text-black dark:text-white">Zero Brokerage Options</span>
                </div>
              </div>

              {/* Primary CTA with Hover Border Gradient */}
              <div className="flex justify-center items-center w-full">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-black text-white flex items-center justify-center space-x-3 text-lg px-10 py-4 dark:bg-white dark:text-black"
                  onClick={handleGetStarted}
                >
                  <Home className="w-5 h-5" />
                  <span>Get Started - It's Free</span>
                </HoverBorderGradient>
              </div>

              {/* Secondary text with List Property option */}
              <p className="text-black/60 dark:text-white/60 text-base">
                Join 100,000+ happy users • No hidden fees • Instant verification
              </p>
              
              <p className="text-black/70 dark:text-white/70 text-sm">
                Already have property to rent?{' '}
                <button 
                  onClick={handleListProperty}
                  className="text-black dark:text-white underline hover:no-underline font-medium"
                >
                  List it here
                </button>
              </p>
            </motion.div>
          </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  icon: Search,
                  title: "Discover",
                  description: "Browse verified properties in your city with detailed photos and information"
                },
                {
                  step: "2", 
                  icon: MessageCircle,
                  title: "Connect",
                  description: "Chat directly with property owners through our secure messaging platform"
                },
                {
                  step: "3",
                  icon: Home, 
                  title: "Move In",
                  description: "Complete paperwork digitally and move in hassle-free with our guided process"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold dark:bg-white dark:text-black">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-black text-white flex items-center justify-center space-x-2 text-lg px-8 py-4 dark:bg-white dark:text-black mx-auto"
                onClick={() => handleCitySelect('Coimbatore')}
              >
                <Search className="w-5 h-5" />
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
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                We're expanding across India's major cities to bring you the best rental experience
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {availableCities.slice(0, 8).map((city, index) => (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleCitySelect(city)}
                  className="group relative p-6 bg-white hover:bg-black hover:text-white rounded-xl font-medium transition-all duration-300 border-2 border-gray-100 hover:border-black dark:bg-gray-700 dark:hover:bg-white dark:hover:text-black dark:border-gray-600 dark:hover:border-white shadow-sm hover:shadow-lg"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-current transition-colors" />
                    <span className="text-sm font-medium">{city}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => handleCitySelect('more')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white hover:bg-black hover:text-white rounded-lg font-medium transition-colors border-2 border-black/10 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-black dark:border-white/10"
              >
                <span>Explore More Cities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                Experience the future of rental with our comprehensive platform designed for modern living
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-6 bg-gray-50 hover:bg-white rounded-xl transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-black text-white flex items-center justify-center space-x-2 text-lg px-8 py-4 dark:bg-white dark:text-black mx-auto"
                onClick={handleGetStarted}
              >
                <Heart className="w-5 h-5" />
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
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Real stories from real people who found their perfect home with RentMate
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <CardContent className="p-0 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <Award className="w-5 h-5 text-blue-500" />
                      </div>
                      
                      <blockquote className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-black dark:text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white dark:from-white dark:to-gray-100 dark:text-black">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full dark:bg-black/10">
                  <Home className="w-12 h-12" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Find Your Home?
              </h2>
              
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
                Join thousands of satisfied customers who found their perfect rental home. 
                No spam, no hidden fees, no complicated setup.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 w-full">
                <HoverBorderGradient
                  containerClassName="rounded-full w-full sm:w-auto"
                  as="button"
                  className="bg-white text-black hover:bg-gray-100 flex items-center justify-center space-x-2 text-lg px-8 py-4 dark:bg-black dark:text-white dark:hover:bg-gray-800 min-w-[240px] w-full sm:w-auto"
                  onClick={handleGetStarted}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Create Free Account</span>
                </HoverBorderGradient>
                
                <HoverBorderGradient
                  containerClassName="rounded-full w-full sm:w-auto"
                  as="button"
                  className="bg-transparent border-2 border-white/30 text-white flex items-center justify-center space-x-2 text-lg px-8 py-4 dark:border-black/30 dark:text-black min-w-[240px] w-full sm:w-auto"
                  onClick={handleListProperty}
                >
                  <Building2 className="w-5 h-5" />
                  <span>List Your Property</span>
                </HoverBorderGradient>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>100% Secure</span>
                </div>
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
        </MobileNav>
      </Navbar>

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