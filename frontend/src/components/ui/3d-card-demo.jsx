"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

export default function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:shadow-2xl hover:shadow-[#B399D4]/[0.1] border-2 border-gray-200 hover:border-[#B399D4] w-auto sm:w-[30rem] h-auto rounded-xl p-6 transition-all duration-300">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-gray-800"
        >
          Experience 3D Property Cards
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-gray-600 text-sm max-w-sm mt-2"
        >
          Hover over property cards to see the amazing 3D perspective effect with our purple theme
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop"
            height="250"
            width="400"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="property thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl text-xs font-normal text-[#B399D4] hover:text-[#A085C4]"
          >
            Learn More →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-[#B399D4] hover:bg-[#A085C4] text-white text-xs font-bold transition-colors"
          >
            View Property
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}