import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

export default function ThreeDRecommendationCard({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onClick,
  variant = "default" 
}) {
  const getVariantColors = (variant) => {
    const variants = {
      default: {
        bg: "bg-white/70",
        border: "border-[#B399D4]/20",
        iconColor: "text-[#B399D4]"
      },
      tiffany: {
        bg: "bg-white/70", 
        border: "border-[#81D4BB]/20",
        iconColor: "text-[#81D4BB]"
      },
      thistle: {
        bg: "bg-white/70",
        border: "border-[#E3C0D5]/20", 
        iconColor: "text-[#E3C0D5]"
      },
      columbia: {
        bg: "bg-white/70",
        border: "border-[#B5D0D9]/20",
        iconColor: "text-[#B5D0D9]"
      }
    };
    return variants[variant] || variants.default;
  };

  const colors = getVariantColors(variant);

  return (
    <CardContainer className="inter-var">
      <CardBody className={`${colors.bg} relative group/card hover:shadow-xl hover:shadow-[#B399D4]/[0.1] border ${colors.border} hover:border-[#B399D4] w-full h-auto rounded-lg p-4 transition-all duration-300`}>
        {/* Icon */}
        <CardItem
          translateZ="80"
          className="text-2xl mb-2"
        >
          <div className={colors.iconColor}>
            {icon}
          </div>
        </CardItem>

        {/* Title */}
        <CardItem
          translateZ="60"
          className="font-medium text-gray-800 mb-2"
        >
          {title}
        </CardItem>

        {/* Description */}
        <CardItem
          translateZ="50"
          className="text-sm text-gray-600 mb-3"
        >
          {description}
        </CardItem>

        {/* Action Button */}
        <CardItem translateZ={40} className="w-full">
          <Button 
            size="sm" 
            className="w-full bg-[#B399D4] hover:bg-[#A085C4] text-white"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </CardItem>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#B399D4]/0 via-[#B399D4]/5 to-[#A085C4]/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardBody>
    </CardContainer>
  );
}