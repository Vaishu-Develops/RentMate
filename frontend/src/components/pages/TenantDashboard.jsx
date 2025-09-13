// pages/TenantDashboard.jsx
"use client";

import React, { useState, useEffect } from 'react';
import BaseDashboard from '../layout/BaseDashboard';
import { 
  CreditCard, 
  Wrench, 
  FileText, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Download,
  Plus,
  TrendingUp,
  MapPin,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

const TenantDashboard = () => {
  const [activeRole, setActiveRole] = useState('tenant');
  const [rentData, setRentData] = useState({
    amountDue: 20000,
    dueDate: '2025-01-01',
    daysUntilDue: 19,
    isOverdue: false
  });
  
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    { id: 1, issue: 'Kitchen Sink Leak', status: 'In Progress', date: '2024-12-10' },
    { id: 2, issue: 'AC Not Cooling', status: 'Submitted', date: '2024-12-12' }
  ]);

  const [rentalInfo] = useState({
    property: '2BHK, RS Puram',
    landlord: 'Rajesh Kumar',
    leaseEnd: '2025-06-30'
  });

  const [recentActivity] = useState([
    { id: 1, text: 'Rent payment processed for November', time: '2 hours ago' },
    { id: 2, text: 'Maintenance request acknowledged', time: '1 day ago' },
    { id: 3, text: 'Lease renewal notice received', time: '3 days ago' }
  ]);

  const quickActions = [
    { icon: CreditCard, label: 'Pay Rent', action: 'payment', color: 'bg-green-500' },
    { icon: Wrench, label: 'Report Issue', action: 'maintenance', color: 'bg-orange-500' },
    { icon: FileText, label: 'View Lease', action: 'lease', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'Message Landlord', action: 'message', color: 'bg-purple-500' }
  ];

  const handleQuickAction = (action) => {
    console.log(`Navigating to ${action}`);
    // Add navigation logic here
  };

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    console.log(`Switched to ${newRole} role`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Submitted': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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
      availableRoles={['tenant', 'seeker']}
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

        {/* Rent Payment Status - Large Prominent Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Rent Payment Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              rentData.isOverdue 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {rentData.isOverdue ? 'Overdue' : 'Upcoming'}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(rentData.amountDue)}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due Date: January 1, 2025 (in {rentData.daysUntilDue} days)
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleQuickAction('payment')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay Now
                </button>
                <button className="bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Requests</h3>
              <button 
                onClick={() => handleQuickAction('maintenance')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Report New Issue
              </button>
            </div>
            
            <div className="space-y-3">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{request.issue}</span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(request.status)}
                      <span className="text-sm text-gray-600">{request.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Submitted on {request.date}</p>
                </div>
              ))}
              
              {maintenanceRequests.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No active maintenance requests</p>
                </div>
              )}
            </div>
          </div>

          {/* My Rental Hub */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Rental Hub</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Property</p>
                  <p className="text-sm text-gray-600">{rentalInfo.property}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Landlord</p>
                  <p className="text-sm text-gray-600">{rentalInfo.landlord}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Lease End Date</p>
                  <p className="text-sm text-gray-600">{rentalInfo.leaseEnd}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Lease
                </button>
              </div>
            </div>
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
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Tips</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Payment Reminder</span>
              </div>
              <p className="text-sm text-blue-800">
                Set up auto-pay to never miss a rent payment and earn reward points.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Set up now →
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Download className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Tax Benefits</span>
              </div>
              <p className="text-sm text-green-800">
                Download HRA receipts for tax savings up to ₹2,00,000 annually.
              </p>
              <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                Download receipts →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rent Paid</span>
              <span className="text-sm font-semibold text-green-600">₹20,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Maintenance Costs</span>
              <span className="text-sm font-semibold text-gray-900">₹0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Days in Property</span>
              <span className="text-sm font-semibold text-gray-900">547 days</span>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default TenantDashboard;
