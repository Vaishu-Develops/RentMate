import React from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { Button } from '@/components/ui/button'
import { MapPin, Home, Car, Wifi, Shield, Heart } from 'lucide-react'
import { formatCurrency, getBHKDisplay, getPropertyTypeIcon } from '@/lib/utils'
import { motion } from 'framer-motion'

const PropertyCard = ({ property, onFavorite, onContact, onViewDetails }) => {
  const {
    _id,
    basicInfo,
    location,
    propertyDetails,
    pricing,
    media,
    amenities,
    availability,
    verification,
    ownerId
  } = property

  const handleFavorite = (e) => {
    e.stopPropagation()
    onFavorite?.(property._id)
  }

  const handleContact = (e) => {
    e.stopPropagation()
    onContact?.(property)
  }

  const handleViewDetails = () => {
    onViewDetails?.(property._id)
  }

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-black/[0.1] dark:bg-gray-900 dark:border-white/[0.2] border-gray-200 w-auto sm:w-[380px] h-auto rounded-xl p-6 border-2">
        
        {/* Property Image */}
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative">
            <img
              src={media?.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop"}
              height="250"
              width="400"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt={basicInfo?.title}
            />
            
            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {verification?.status === 'verified' && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
              {pricing?.brokerageType === 'owner_direct' && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Owner Direct
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>

            {/* Property Type Icon */}
            <div className="absolute bottom-3 left-3">
              <span className="text-2xl bg-white/80 backdrop-blur-sm rounded-full p-2">
                {getPropertyTypeIcon(basicInfo?.type)}
              </span>
            </div>
          </div>
        </CardItem>

        {/* Property Title */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-black dark:text-white mt-4"
        >
          {basicInfo?.title || 'Beautiful Property'}
        </CardItem>

        {/* Location */}
        <CardItem
          as="p"
          translateZ="60"
          className="text-gray-600 text-sm mt-2 dark:text-gray-400 flex items-center"
        >
          <MapPin className="w-4 h-4 mr-1" />
          {location?.area}, {location?.city}
        </CardItem>

        {/* Property Details */}
        <CardItem translateZ="40" className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {getBHKDisplay(basicInfo?.bhkType)}
              </span>
              <span>{propertyDetails?.carpetArea} sqft</span>
              {propertyDetails?.parking?.available && (
                <span className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  Parking
                </span>
              )}
            </div>
          </div>
        </CardItem>

        {/* Amenities */}
        <CardItem translateZ="30" className="mt-3">
          <div className="flex flex-wrap gap-2">
            {amenities?.basic?.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {amenity.replace('_', ' ')}
              </span>
            ))}
            {amenities?.connectivity?.includes('wifi') && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center">
                <Wifi className="w-3 h-3 mr-1" />
                WiFi
              </span>
            )}
          </div>
        </CardItem>

        {/* Pricing */}
        <CardItem translateZ="40" className="mt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(pricing?.monthlyRent || 0)}
              </div>
              <div className="text-sm text-gray-500">
                + {formatCurrency(pricing?.securityDeposit || 0)} deposit
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {pricing?.maintenanceCharges ? `+${formatCurrency(pricing.maintenanceCharges)} maintenance` : 'Maintenance included'}
              </div>
              {pricing?.negotiable && (
                <div className="text-xs text-green-600 font-medium">
                  Negotiable
                </div>
              )}
            </div>
          </div>
        </CardItem>

        {/* Availability Status */}
        <CardItem translateZ="20" className="mt-3">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              availability?.status === 'available' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {availability?.status === 'available' ? 'Available Now' : 'Not Available'}
            </span>
            {availability?.availableFrom && (
              <span className="text-xs text-gray-500">
                From {new Date(availability.availableFrom).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardItem>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="button"
            onClick={handleContact}
            className="px-4 py-2 rounded-xl text-xs font-normal text-black dark:text-white border-2 border-gray-300 hover:border-black hover:text-black dark:border-gray-600 dark:hover:border-white dark:hover:text-white transition-colors"
          >
            Contact Owner
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            onClick={handleViewDetails}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            View Details
          </CardItem>
        </div>

        {/* AI-Generated Description Preview */}
        {basicInfo?.aiGeneratedDescription && (
          <CardItem
            translateZ="10"
            className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
          >
            <div className="text-xs text-blue-600 font-medium mb-1">
              🤖 AI Insight
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {basicInfo.aiGeneratedDescription.substring(0, 120)}...
            </p>
          </CardItem>
        )}
      </CardBody>
    </CardContainer>
  )
}

export default PropertyCard