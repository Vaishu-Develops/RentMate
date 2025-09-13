# Profile Management System

## Overview
Comprehensive user profile management system for RentMate that allows users to manage their personal information, role settings, verification status, privacy preferences, and notification settings.

## URL
`http://localhost:3000/profile`

## Features

### 1. Personal Information Management
- **Profile Picture Upload**: Users can upload and update their profile picture
- **Basic Details**: Name, email, phone, date of birth, address management
- **Professional Info**: Occupation, company, monthly income
- **Bio Section**: Personal description and about section
- **Edit Mode**: Toggle between view and edit modes for profile updates

### 2. Role Management System
- **Active Role Display**: Shows current active role with visual indicator
- **Role Switching**: Switch between available roles (tenant/landlord)
- **Role-specific Features**: Different capabilities based on active role
- **Multi-role Support**: Users can have multiple roles and switch between them

### 3. Verification Center
- **Identity Verification**: Government ID upload and verification
- **Phone Verification**: OTP-based phone number verification
- **Email Verification**: Email address verification status
- **Income Verification**: Salary slips and bank statement uploads
- **Address Verification**: Address proof document uploads
- **Verification Benefits**: List of benefits for verified users

### 4. Privacy Settings
- **Data Sharing Control**: Choose what information is visible to others
- **Phone Visibility**: Control phone number visibility
- **Email Visibility**: Control email address visibility  
- **Address Visibility**: Control address information visibility
- **Income Visibility**: Control income information visibility
- **Account Privacy**: Data download and account deletion options

### 5. Communication Preferences
- **Email Notifications**: 
  - Property updates and alerts
  - Rent payment reminders
  - Message notifications
  - Marketing communications
- **SMS Notifications**:
  - Rent payment reminders
  - Emergency alerts
  - OTP codes for security
- **Push Notifications**:
  - Message alerts
  - Property matching alerts
  - Payment reminders

### 6. Logout Feature
- **Secure Logout**: Integrated logout functionality throughout the profile
- **Session Management**: Proper token cleanup and state reset

## Technical Implementation

### File Structure
```
src/
├── components/
│   └── profile/
│       └── ProfilePage.jsx          # Main profile component
├── store/
│   └── authStore.js                 # Updated with profile methods
└── App.jsx                          # Updated routing
```

### Key Components

#### ProfilePage.jsx
- **Tab-based Interface**: 5 main sections (Personal, Roles, Verification, Privacy, Notifications)
- **Responsive Design**: Mobile-optimized with collapsible navigation
- **Real-time Updates**: Live state management with form validation
- **API Integration**: Connected to backend for profile updates

#### AuthStore Updates
- **updateProfile()**: API call for profile updates
- **switchRole()**: Async role switching with backend sync
- **Enhanced State Management**: Better profile data handling

### API Endpoints Used
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/switch-role` - Switch active role
- `GET /api/auth/me` - Get current user data

### Security Features
- **Protected Routes**: Only authenticated users can access
- **Token-based Authentication**: Secure API calls
- **Data Validation**: Client and server-side validation
- **Privacy Controls**: Granular data sharing permissions

## User Experience

### Navigation
- **Consistent Header**: Same navigation as other pages
- **Tab Interface**: Easy switching between profile sections
- **Mobile Support**: Responsive design for all devices
- **Breadcrumbs**: Clear navigation within profile sections

### Visual Design
- **Clean Interface**: Modern, professional design
- **Status Indicators**: Clear verification and privacy status
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Screen reader friendly and keyboard navigation

### Functionality
- **Auto-save**: Seamless profile updates
- **Real-time Feedback**: Immediate success/error messages
- **Form Validation**: Client-side validation with helpful error messages
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Future Enhancements

### Planned Features
1. **Profile Completion Score**: Gamified profile completion
2. **Social Features**: Connect with other users
3. **Advanced Verification**: Biometric verification options
4. **Bulk Privacy Controls**: Quick privacy setting presets
5. **Export Profile**: Download profile as PDF
6. **Profile Analytics**: Usage statistics and insights

### Integration Points
- **Property Management**: Link to owned/rented properties
- **Payment History**: Connect to transaction history
- **Message Center**: Integration with communication system
- **Document Storage**: Centralized document management

## Usage Examples

### For Tenants
- Update income information for property applications
- Manage verification documents for landlord trust
- Set notification preferences for rent reminders
- Switch to landlord role if they own properties

### For Landlords
- Verify identity for tenant trust
- Manage contact information visibility
- Set up notifications for property inquiries
- Update professional information

## Benefits
- **Increased Trust**: Verified profiles build confidence
- **Better Matches**: Complete profiles get better property matches
- **Privacy Control**: Users control their data sharing
- **Streamlined Experience**: Single place for all profile management
- **Multi-role Flexibility**: Easy switching between tenant/landlord roles

This comprehensive profile system enhances user experience while maintaining security and privacy standards.
