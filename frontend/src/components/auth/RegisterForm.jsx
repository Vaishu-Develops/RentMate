import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authAPI } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { cn } from '@/lib/utils'

const RegisterForm = () => {
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60) // 1 minute in seconds
  const [canResend, setCanResend] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const setUser = useAuthStore(state => state.setUser)

  const intentOptions = [
    {
      id: 'search',
      title: "I'm looking for a place to rent",
      description: "Find your perfect home with verified properties",
      icon: "🏠",
      initialRole: 'commonUser'
    },
    {
      id: 'list',
      title: "I want to list my property",
      description: "Rent out your property with AI-powered tools",
      icon: "🏢",
      initialRole: 'landlord'
    },
    {
      id: 'explore',
      title: "Just exploring for now",
      description: "Browse and learn about the platform",
      icon: "👀",
      initialRole: 'commonUser'
    }
  ]

  const handleIntentSelect = (selectedIntent) => {
    setIntent(selectedIntent)
    setStep(2)
  }

  // Timer effect for OTP expiration
  React.useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [step, timer])

  // Format timer display (mm:ss)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    const registrationData = {
      ...data,
      intent,
      initialRole: intentOptions.find(opt => opt.id === intent)?.initialRole || 'commonUser'
    }
    
    try {
      console.log('📤 Sending registration data:', registrationData)
      
      const response = await authAPI.register(registrationData)
      
      if (response.data.success) {
        setUserEmail(data.email)
        setStep(3) // Move to email verification
        setTimer(60) // Reset timer to 1 minute
        setCanResend(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Registration data sent:', registrationData)
      
      // Show specific error message to user
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      alert(errorMessage) // You can replace this with a proper toast notification
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerifyEmail = async () => {
    const code = verificationCode.join('')
    if (code.length === 6) {
      setIsLoading(true)
      try {
        const response = await authAPI.verifyEmail(code)
        if (response.data.success) {
          setUser(response.data.user, response.data.token)
          // Redirect based on intent
          window.location.href = intent === 'list' ? '/dashboard/landlord' : '/dashboard'
        }
      } catch (error) {
        console.error('Verification error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleResendOTP = async () => {
    if (!canResend || !userEmail) return
    
    setIsLoading(true)
    try {
      const response = await authAPI.resendOTP({ email: userEmail })
      if (response.data.success) {
        setTimer(60) // Reset timer to 1 minute
        setCanResend(false)
        setVerificationCode(['', '', '', '', '', '']) // Clear previous code
        // You can add a success toast here
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            {step === 1 && "Join RentMate"}
            {step === 2 && "Create Your Account"}
            {step === 3 && "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {step === 1 && "What brings you here today?"}
            {step === 2 && "Fill in your details to get started"}
            {step === 3 && "We sent a 6-digit code to your email"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Step 1: Intent Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {intentOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleIntentSelect(option.id)}
                  className={cn(
                    "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                    "hover:border-black hover:bg-black/5 dark:hover:border-white dark:hover:bg-white/5",
                    "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white",
                    "border-gray-300 dark:border-gray-600"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">{option.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div>
                <Input
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="Full Name"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="Email Address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  placeholder="Phone Number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  placeholder="Password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === watch('password') || 'Passwords do not match'
                  })}
                  type="password"
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('city', { 
                    required: 'City is required',
                    minLength: {
                      value: 2,
                      message: 'City must be at least 2 characters'
                    }
                  })}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                  type="checkbox"
                  id="agreeToTerms"
                  className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:text-white dark:focus:ring-white"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the <a href="/terms" className="text-black hover:underline dark:text-white">Terms & Privacy Policy</a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-black hover:underline dark:text-white">
                  Sign in instead
                </a>
              </p>
            </motion.form>
          )}

          {/* Step 3: Email Verification */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the 6-digit code sent to your email
                </p>
                
                <div className="flex justify-center space-x-2 mb-4">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:border-black focus:outline-none dark:focus:border-white dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  {timer > 0 ? (
                    <>Code expires in: <span className="font-semibold">{formatTimer(timer)}</span></>
                  ) : (
                    <span className="text-red-500 font-semibold">Code has expired</span>
                  )}
                </p>

                <Button
                  onClick={handleVerifyEmail}
                  disabled={isLoading || verificationCode.join('').length !== 6 || timer <= 0}
                  className="w-full mb-4"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <button 
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                  className={`text-sm ${canResend && !isLoading 
                    ? 'text-black hover:underline dark:text-white cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'}`}
                >
                  {isLoading ? 'Sending...' : canResend ? 'Resend Code' : 'Didn\'t receive the code? Resend'}
                </button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm