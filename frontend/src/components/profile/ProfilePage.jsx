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
import { 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Edit3, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Briefcase,
  Home,
  CreditCard,
  FileText,
  Settings,
  UserCheck,
  Building,
  DollarSign
} from 'lucide-react'
import useAuthStore from '@/store/authStore'

const ProfilePage = () => {
  const { user, isAuthenticated, activeRole, switchRole, logout, updateProfile } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    company: '',
    monthlyIncome: '',
    bio: ''
  })
  const [privacySettings, setPrivacySettings] = useState({
    showPhone: true,
    showEmail: false,
    showAddress: false,
    showIncome: false
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      propertyUpdates: true,
      rentReminders: true,
      messages: true,
      marketing: false
    },
    sms: {
      rentReminders: true,
      emergencyAlerts: true,
      otpCodes: true
    },
    push: {
      messages: true,
      propertyAlerts: true,
      paymentReminders: true
    }
  })

  // Navigation items for authenticated users
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Search", link: "/search" },
    { name: "Messages", link: "/messages" }
  ]

  useEffect(() => {
    if (user?.personalInfo) {
      setProfileData({
        name: user.personalInfo.name || '',
        email: user.email || '',
        phone: user.personalInfo.phone || '',
        dateOfBirth: user.personalInfo.dateOfBirth || '',
        address: user.personalInfo.address || '',
        city: user.personalInfo.city || '',
        state: user.personalInfo.state || '',
        pincode: user.personalInfo.pincode || '',
        occupation: user.personalInfo.occupation || '',
        company: user.personalInfo.company || '',
        monthlyIncome: user.personalInfo.monthlyIncome || '',
        bio: user.personalInfo.bio || ''
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData)
      setEditMode(false)
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error)
      // Show error message
    }
  }

  const handleRoleSwitch = async (newRole) => {
    try {
      await switchRole(newRole)
      // Show success message
    } catch (error) {
      console.error('Failed to switch role:', error)
      // Show error message
    }
  }

  const verificationStatus = {
    identity: user?.verification?.identity || 'pending',
    phone: user?.verification?.phone || 'verified',
    email: user?.verification?.email || 'verified',
    income: user?.verification?.income || 'pending',
    address: user?.verification?.address || 'pending'
  }

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'roles', label: 'Role Management', icon: UserCheck },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <Button href="/login">Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, {user?.personalInfo?.name}!
            </div>
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

      {/* Header */}
      <section className="pt-32 pb-8 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user?.personalInfo?.profilePicture ? (
                  <img 
                    src={user.personalInfo.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 hover:bg-primary/90">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.personalInfo?.name || 'User'}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </span>
                {user?.personalInfo?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user.personalInfo.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                  {activeRole}
                </span>
                {user?.roles?.length > 1 && (
                  <span className="text-sm text-gray-500">
                    +{user.roles.length - 1} more role{user.roles.length > 2 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
              {editMode && (
                <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex space-x-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <Input
                      value={profileData.occupation}
                      onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter your occupation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income
                    </label>
                    <Input
                      type="number"
                      value={profileData.monthlyIncome}
                      onChange={(e) => setProfileData({...profileData, monthlyIncome: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter monthly income"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!editMode}
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!editMode}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Role Management Tab */}
          {activeTab === 'roles' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Current Active Role</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-primary text-white rounded-lg capitalize font-medium">
                      {activeRole}
                    </span>
                    <span className="text-blue-700">
                      You are currently operating as a {activeRole}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Available Roles</h3>
                  <div className="space-y-3">
                    {user?.roles?.map((role) => (
                      <div
                        key={role}
                        className={`p-4 border rounded-lg ${
                          role === activeRole ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {role === 'tenant' && <Home className="w-5 h-5 text-blue-500" />}
                            {role === 'landlord' && <Building className="w-5 h-5 text-green-500" />}
                            <div>
                              <h4 className="font-medium capitalize">{role}</h4>
                              <p className="text-sm text-gray-600">
                                {role === 'tenant' && 'Search and rent properties'}
                                {role === 'landlord' && 'List and manage properties'}
                              </p>
                            </div>
                          </div>
                          {role !== activeRole && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleSwitch(role)}
                            >
                              Switch to {role}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Need Additional Roles?</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Contact our support team to add new roles to your account.
                  </p>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Center Tab */}
          {activeTab === 'verification' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">Verification Status</h3>
                  <p className="text-yellow-800 text-sm">
                    Complete your verification to build trust and unlock all features.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Identity Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(verificationStatus.identity)}
                      <div>
                        <h4 className="font-medium">Identity Verification</h4>
                        <p className="text-sm text-gray-600">
                          Verify your identity with government ID
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={verificationStatus.identity === 'verified' ? 'outline' : 'default'}
                      size="sm"
                      disabled={verificationStatus.identity === 'verified'}
                    >
                      {verificationStatus.identity === 'verified' ? 'Verified' : 'Upload ID'}
                    </Button>
                  </div>

                  {/* Phone Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(verificationStatus.phone)}
                      <div>
                        <h4 className="font-medium">Phone Verification</h4>
                        <p className="text-sm text-gray-600">
                          Verify your phone number with OTP
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={verificationStatus.phone === 'verified' ? 'outline' : 'default'}
                      size="sm"
                      disabled={verificationStatus.phone === 'verified'}
                    >
                      {verificationStatus.phone === 'verified' ? 'Verified' : 'Verify Phone'}
                    </Button>
                  </div>

                  {/* Email Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(verificationStatus.email)}
                      <div>
                        <h4 className="font-medium">Email Verification</h4>
                        <p className="text-sm text-gray-600">
                          Verify your email address
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={verificationStatus.email === 'verified' ? 'outline' : 'default'}
                      size="sm"
                      disabled={verificationStatus.email === 'verified'}
                    >
                      {verificationStatus.email === 'verified' ? 'Verified' : 'Verify Email'}
                    </Button>
                  </div>

                  {/* Income Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(verificationStatus.income)}
                      <div>
                        <h4 className="font-medium">Income Verification</h4>
                        <p className="text-sm text-gray-600">
                          Upload salary slips or bank statements
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={verificationStatus.income === 'verified' ? 'outline' : 'default'}
                      size="sm"
                      disabled={verificationStatus.income === 'verified'}
                    >
                      {verificationStatus.income === 'verified' ? 'Verified' : 'Upload Documents'}
                    </Button>
                  </div>

                  {/* Address Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(verificationStatus.address)}
                      <div>
                        <h4 className="font-medium">Address Verification</h4>
                        <p className="text-sm text-gray-600">
                          Verify your current address
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={verificationStatus.address === 'verified' ? 'outline' : 'default'}
                      size="sm"
                      disabled={verificationStatus.address === 'verified'}
                    >
                      {verificationStatus.address === 'verified' ? 'Verified' : 'Upload Proof'}
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Verification Benefits</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Increased trust from landlords/tenants</li>
                    <li>• Priority in property applications</li>
                    <li>• Access to premium features</li>
                    <li>• Higher profile visibility</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings Tab */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Data Sharing Preferences</h3>
                  <p className="text-blue-800 text-sm">
                    Control what information is visible to other users on the platform.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Show Phone Number</h4>
                        <p className="text-sm text-gray-600">
                          Allow other users to see your phone number
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrivacySettings({
                          ...privacySettings,
                          showPhone: !privacySettings.showPhone
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.showPhone ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Show Email Address</h4>
                        <p className="text-sm text-gray-600">
                          Allow other users to see your email address
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrivacySettings({
                          ...privacySettings,
                          showEmail: !privacySettings.showEmail
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.showEmail ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Show Address</h4>
                        <p className="text-sm text-gray-600">
                          Allow other users to see your address
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrivacySettings({
                          ...privacySettings,
                          showAddress: !privacySettings.showAddress
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.showAddress ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacySettings.showAddress ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Show Income Information</h4>
                        <p className="text-sm text-gray-600">
                          Allow landlords to see your income details
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrivacySettings({
                          ...privacySettings,
                          showIncome: !privacySettings.showIncome
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.showIncome ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacySettings.showIncome ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Privacy</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Communication Preferences</h3>
                  <p className="text-blue-800 text-sm">
                    Choose how you want to receive notifications and updates from RentMate.
                  </p>
                </div>

                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'propertyUpdates' && 'Get notified about new properties and updates'}
                            {key === 'rentReminders' && 'Receive rent payment reminders'}
                            {key === 'messages' && 'Get notified about new messages'}
                            {key === 'marketing' && 'Receive promotional emails and offers'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              [key]: !value
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'rentReminders' && 'SMS reminders for rent payments'}
                            {key === 'emergencyAlerts' && 'Important alerts and emergency notifications'}
                            {key === 'otpCodes' && 'One-time passwords for security verification'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            sms: {
                              ...notificationSettings.sms,
                              [key]: !value
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'messages' && 'Get notified about new chat messages'}
                            {key === 'propertyAlerts' && 'Alerts about properties matching your criteria'}
                            {key === 'paymentReminders' && 'Reminders for upcoming payments'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            push: {
                              ...notificationSettings.push,
                              [key]: !value
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button>Save Notification Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
