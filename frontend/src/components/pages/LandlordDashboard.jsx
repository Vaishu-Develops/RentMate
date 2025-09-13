// pages/LandlordDashboard.jsx
"use client";

import React, { useState } from 'react';
import BaseDashboard from '../layout/BaseDashboard';
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  BarChart3,
  Home,
  UserCheck,
  Settings,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandlordDashboard = () => {
  const [activeRole, setActiveRole] = useState('landlord');
  
  // Sample data
  const [portfolioData] = useState({
    totalProperties: 3,
    occupiedProperties: 2,
    monthlyIncome: 35000,
    monthlyExpenses: 5000,
    occupancyRate: 67
  });

  const [priorityTasks] = useState([
    { 
      id: 1, 
      type: 'application', 
      message: '2 New Applications to Review', 
      urgency: 'high',
      action: 'review-applications'
    },
    { 
      id: 2, 
      type: 'maintenance', 
      message: '1 New Maintenance Request', 
      urgency: 'medium',
      action: 'view-maintenance'
    },
    { 
      id: 3, 
      type: 'lease', 
      message: 'Lease expiring in 30 days', 
      urgency: 'high',
      action: 'contact-tenant'
    }
  ]);

  const [recentApplications] = useState([
    { id: 1, name: 'Amit Sharma', property: '2BHK RS Puram', date: '2024-12-12', status: 'pending' },
    { id: 2, name: 'Priya Patel', property: '3BHK Saibaba Colony', date: '2024-12-11', status: 'under_review' }
  ]);

  const [activeProperties] = useState([
    { 
      id: 1, 
      name: '2BHK RS Puram', 
      tenant: 'John Doe', 
      rent: 20000, 
      status: 'occupied',
      lastPayment: '2024-11-01'
    },
    { 
      id: 2, 
      name: '3BHK Saibaba Colony', 
      tenant: 'Jane Smith', 
      rent: 15000, 
      status: 'occupied',
      lastPayment: '2024-11-05'
    },
    { 
      id: 3, 
      name: '1BHK Gandhipuram', 
      tenant: null, 
      rent: 12000, 
      status: 'vacant',
      lastPayment: null
    }
  ]);

  const [recentActivity] = useState([
    { id: 1, text: 'New application received for RS Puram property', time: '1 hour ago' },
    { id: 2, text: 'Rent payment received from John Doe', time: '2 days ago' },
    { id: 3, text: 'Maintenance request completed at Saibaba Colony', time: '3 days ago' }
  ]);

  const quickActions = [
    { icon: Eye, label: 'Review Apps', action: 'applications', color: 'bg-blue-500' },
    { icon: Plus, label: 'Add Property', action: 'list-property', color: 'bg-green-500' },
    { icon: BarChart3, label: 'View Finances', action: 'finances', color: 'bg-purple-500' },
    { icon: MessageSquare, label: 'Message Tenants', action: 'messages', color: 'bg-orange-500' }
  ];

  const handleQuickAction = (action) => {
    console.log(`Navigating to ${action}`);
    // Add navigation logic here
  };

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    console.log(`Switched to ${newRole} role`);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <BaseDashboard 
      userRole={activeRole}
      userName="Priya"
      availableRoles={['landlord', 'seeker']}
      onRoleSwitch={handleRoleSwitch}
    >
      {/* Main Content Area (70% width) */}
      <div className="flex-1 lg:w-2/3">
        {/* Quick Actions Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.action)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`${action.color} p-3 rounded-full mb-2`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Priority Tasks - Most Important Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Priority Tasks
            </h2>
            <span className="text-sm text-gray-500">{priorityTasks.length} items need attention</span>
          </div>
          
          <div className="space-y-3">
            {priorityTasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className={`border-l-4 p-4 rounded-lg ${getUrgencyColor(task.urgency)} cursor-pointer`}
                onClick={() => handleQuickAction(task.action)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {task.type === 'application' && <FileText className="h-5 w-5 text-blue-600" />}
                      {task.type === 'maintenance' && <Wrench className="h-5 w-5 text-orange-600" />}
                      {task.type === 'lease' && <Calendar className="h-5 w-5 text-purple-600" />}
                    </div>
                    <span className="font-medium text-gray-900">{task.message}</span>
                  </div>
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAction(task.action);
                    }}
                  >
                    {task.action === 'review-applications' && 'View Now'}
                    {task.action === 'view-maintenance' && 'View'}
                    {task.action === 'contact-tenant' && 'Contact Tenant'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Financial Summary and Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Income (December)</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(portfolioData.monthlyIncome)}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Expenses (December)</span>
                  <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(portfolioData.monthlyExpenses)}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(portfolioData.monthlyIncome - portfolioData.monthlyExpenses)}
                </div>
              </div>
              
              <button 
                onClick={() => handleQuickAction('finances')}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                View Full Report →
              </button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Overview</h3>
              <Building className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Total Properties</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{portfolioData.totalProperties}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Occupied</span>
                </div>
                <span className="text-lg font-bold text-green-700">{portfolioData.occupiedProperties}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Vacant</span>
                </div>
                <span className="text-lg font-bold text-red-700">
                  {portfolioData.totalProperties - portfolioData.occupiedProperties}
                </span>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Occupancy Rate</span>
                  <span className="text-lg font-bold text-blue-700">{portfolioData.occupancyRate}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${portfolioData.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={() => handleQuickAction('properties')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Manage Properties →
              </button>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <button 
              onClick={() => handleQuickAction('applications')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All Applications →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Applicant</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Property</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((application) => (
                  <tr key={application.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {application.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{application.property}</td>
                    <td className="py-3 text-sm text-gray-600">{application.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar (30% width) */}
      <div className="lg:w-1/3 space-y-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Market Opportunity</span>
              </div>
              <p className="text-sm text-green-800">
                Your RS Puram property rent is 15% below market rate. Consider increasing by ₹3,000.
              </p>
              <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                View Analysis →
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Tenant Screening</span>
              </div>
              <p className="text-sm text-blue-800">
                AI screening shows Amit Sharma has excellent credit score and stable income.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Review Profile →
              </button>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-900">Lease Renewal</span>
              </div>
              <p className="text-sm text-purple-800">
                Start lease renewal process for John Doe 60 days early to ensure continuity.
              </p>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium">
                Start Process →
              </button>
            </div>
          </div>
        </div>

        {/* Property Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
          <div className="space-y-4">
            {activeProperties.map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{property.name}</h4>
                    <p className="text-xs text-gray-600">
                      {property.tenant ? `Tenant: ${property.tenant}` : 'Vacant'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(property.rent)}/month
                  </span>
                  {property.status === 'occupied' && (
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  )}
                </div>
                {property.lastPayment && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last payment: {property.lastPayment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications Received</span>
              <span className="text-lg font-semibold text-blue-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Properties Rented</span>
              <span className="text-lg font-semibold text-green-600">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance Requests</span>
              <span className="text-lg font-semibold text-orange-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Collection Rate</span>
              <span className="text-lg font-semibold text-green-600">100%</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => handleQuickAction('analytics')}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default LandlordDashboard;
