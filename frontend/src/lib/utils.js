import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const generateReceiptNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `RCP${year}${month}${day}${random}`
}

export const calculateHRAExemption = (rentPaid, basicSalary, cityTier = 'metro') => {
  const hraReceived = basicSalary * 0.5 // Assuming 50% HRA
  const excessRent = Math.max(0, rentPaid - (basicSalary * 0.1))
  const cityLimit = cityTier === 'metro' ? basicSalary * 0.5 : basicSalary * 0.4
  
  return Math.min(hraReceived, excessRent, cityLimit)
}

export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''))
}

export const getPropertyTypeIcon = (type) => {
  const icons = {
    apartment: '🏢',
    house: '🏠',
    studio: '🏠',
    pg: '🏨',
    villa: '🏡'
  }
  return icons[type] || '🏠'
}

export const getBHKDisplay = (bhkType) => {
  const bhkMap = {
    '1rk': '1 RK',
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK',
    '4bhk': '4+ BHK',
    'studio': 'Studio'
  }
  return bhkMap[bhkType] || bhkType
}