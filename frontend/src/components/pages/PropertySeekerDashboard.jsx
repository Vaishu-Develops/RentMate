import React, { useState } from 'react';
import { Search, Heart, FileText, User, Bell, Settings, MapPin, TrendingUp } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton
} from '../ui/resizable-navbar';

const PropertySeekerDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Search', link: '/search' },
    { name: 'Saved', link: '/saved' },
    { name: 'Applications', link: '/applications' },
    { name: 'Messages', link: '/messages' }
  ];

  const handleNavItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Resizable Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleNavItemClick} />
          <div className="flex items-center gap-2">
            <NavbarButton href="/profile" variant="secondary">
              <User className="h-4 w-4 mr-2" />
              Profile
            </NavbarButton>
            <NavbarButton href="/search" variant="primary">
              <Search className="h-4 w-4 mr-2" />
              Find Properties
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
          
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={handleNavItemClick}
              >
                {item.name}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href="/profile"
                className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center"
                onClick={handleNavItemClick}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      {/* Dashboard Content */}
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Property Search Dashboard</h1>
            <p className="text-gray-600 mt-2">Find your perfect rental home</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Searches</p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Saved Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">8</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Applications</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">New Updates</p>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    <Search className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-900">Search Properties</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                    <Heart className="h-8 w-8 text-red-600 mb-2" />
                    <span className="text-sm font-medium text-red-900">View Saved</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
                    <FileText className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">Applications</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
                    <Settings className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">Settings</span>
                  </button>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Searched properties in Coimbatore</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Saved 2BHK apartment in RS Puram</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Applied for 1BHK in Gandhipuram</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Market Insights */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">Average Rent</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">₹22,000</p>
                    <p className="text-xs text-blue-700">in Coimbatore</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-900">New Listings</span>
                    </div>
                    <p className="text-lg font-semibold text-green-900">45</p>
                    <p className="text-xs text-green-700">this week</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Search */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Search</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                    1BHK under ₹15,000
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                    2BHK in RS Puram
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                    Furnished apartments
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                    Near IT parks
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertySeekerDashboard;
