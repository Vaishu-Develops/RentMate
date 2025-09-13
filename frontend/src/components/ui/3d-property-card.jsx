import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Eye } from "lucide-react";

export default function ThreeDPropertyCard({ property, onPropertyClick }) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-[#B399D4]/[0.1] border-2 border-gray-200 hover:border-[#B399D4] w-full h-auto rounded-xl p-0 transition-all duration-300">
        {/* Property Image */}
        <CardItem translateZ="100" className="w-full">
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={property.image}
              alt={`${property.type} in ${property.location}`}
              className="h-48 w-full object-cover group-hover/card:scale-105 transition-transform duration-300"
            />
            {/* Verification Badge */}
            {property.verified && (
              <CardItem
                translateZ="120"
                className="absolute top-3 left-3"
              >
                <div className="bg-[#B399D4] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  ✓ Owner Verified
                </div>
              </CardItem>
            )}
            
            {/* Save Button */}
            <CardItem
              translateZ="120"
              className="absolute top-3 right-3"
            >
              <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors">
                <Heart className="w-4 h-4 text-gray-600 hover:text-[#B399D4]" />
              </button>
            </CardItem>
          </div>
        </CardItem>

        {/* Property Details */}
        <div className="p-4 space-y-3">
          {/* Price */}
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-gray-800"
          >
            ₹{property.price.toLocaleString()}/month
            <span className="text-sm font-normal text-gray-600 ml-2">
              + ₹{property.maintenance.toLocaleString()} maint.
            </span>
          </CardItem>

          {/* Property Info */}
          <CardItem
            translateZ="60"
            className="text-gray-600"
          >
            {property.type} • {property.area} sqft • {property.location}
          </CardItem>

          {/* Location */}
          <CardItem
            translateZ="70"
            className="flex items-center text-sm text-gray-600"
          >
            <MapPin className="w-3 h-3 mr-1 text-[#B399D4]" />
            {property.distance}
          </CardItem>

          {/* Response Time */}
          <CardItem
            translateZ="80"
            className="text-sm text-gray-600"
          >
            👤 Responds in {property.responseTime}
          </CardItem>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <CardItem translateZ={20} className="flex-1">
              <Button
                className="w-full bg-[#B399D4] hover:bg-[#A085C4] text-white"
                onClick={() => onPropertyClick(property.id)}
              >
                View Details
              </Button>
            </CardItem>
            
            <CardItem translateZ={20}>
              <Button
                variant="outline"
                size="icon"
                className="border-[#B399D4] text-[#B399D4] hover:bg-[#B399D4] hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </CardItem>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B399D4]/0 via-[#B399D4]/5 to-[#A085C4]/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardBody>
    </CardContainer>
  );
}