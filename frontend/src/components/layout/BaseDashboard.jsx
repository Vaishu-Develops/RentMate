// components/layout/BaseDashboard.jsx
"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Home, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BaseDashboard = ({ 
  children, 
  userRole = "seeker", 
  userName = "User",
  onRoleSwitch,
  availableRoles = ["seeker"],
  className = "" 
}) => {
  console.log('🏗️ BaseDashboard rendering with:', { userRole, userName, availableRoles });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Search, label: 'Properties', href: '/properties' },
    { icon: MessageSquare, label: 'Messages', href: '/messages', badge: 2 },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Support', href: '/support' }
  ];
  const getRoleColor = (role) => {
    const colors = {
      'tenant': 'bg-blue-100 text-blue-800 border-blue-200',
      'landlord': 'bg-green-100 text-green-800 border-green-200',
      'seeker': 'bg-purple-100 text-purple-800 border-purple-200',
      'commonuser': 'bg-gray-100 text-gray-800 border-gray-200',
      'commonUser': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Global Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏠</span>
                </div>
                <span className="ml-2 font-bold text-xl text-gray-900">RentEase</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navigationItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative ${
                      item.active 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isRoleSwitcherOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">Active Role:</p>
                      </div>
                      {availableRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => onRoleSwitch && onRoleSwitch(role)}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            role === userRole ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-500"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                  {getGreeting()}, {userName}! 
                  <span className="ml-2 text-2xl">👋</span>
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Your Active Role:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(userRole)}`}>
                  {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDashboard;
