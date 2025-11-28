'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function OTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const type = searchParams.get('type') // 'signup' or 'reset'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    if (!email) {
      router.push('/auth/login')
    }
    // Focus first input on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus()
    }
  }, [email, router])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^[0-9]+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char
      }
    })
    setOtp(newOtp)

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, 5)
    inputRefs[lastFilledIndex].current?.focus()
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpComplete) return

    setLoading(true)
    setError('')

    const otpCode = otp.join('')

    try {
      if (type === 'signup') {
        // Verify OTP for signup
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'signup'
        })

        if (error) {
          setError(error.message || 'Invalid OTP. Please try again.')
          setLoading(false)
          return
        }

        if (data.user) {
          // OTP verified, redirect to form page to complete profile
          router.push('/auth/form')
        }
      } else if (type === 'reset') {
        // Verify OTP for password reset
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'recovery'
        })

        if (error) {
          setError(error.message || 'Invalid OTP. Please try again.')
          setLoading(false)
          return
        }

        if (data.user) {
          // OTP verified, redirect to reset password page
          router.push('/auth/reset-password')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    // Check if cooldown is active
    if (resendCooldown > 0) {
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')
    setOtp(['', '', '', '', '', ''])

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email
        })
        if (error) {
          if (error.message.includes('rate limit')) {
            setError('Too many requests. Please wait a moment before trying again.')
            setResendCooldown(120) // 2 minutes cooldown for rate limit
          } else {
            setError(error.message)
          }
        } else {
          setSuccessMessage('OTP resent successfully! Please check your email.')
          setResendCooldown(60) // 60 seconds cooldown
          // Focus first input
          if (inputRefs[0].current) {
            inputRefs[0].current.focus()
          }
        }
      } else if (type === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        })
        if (error) {
          if (error.message.includes('rate limit')) {
            setError('Too many requests. Please wait a moment before trying again.')
            setResendCooldown(120) // 2 minutes cooldown for rate limit
          } else {
            setError(error.message)
          }
        } else {
          setSuccessMessage('OTP resent successfully! Please check your email.')
          setResendCooldown(60) // 60 seconds cooldown
          // Focus first input
          if (inputRefs[0].current) {
            inputRefs[0].current.focus()
          }
        }
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)'
        }}
      />

      {/* OTP Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo/logo.svg" 
            alt="HPD Logo" 
            width={80} 
            height={55}
            priority
          />
        </div>

        <h2 className="text-2xl font-bold text-black text-center mb-3">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-8">
          We've sent a 6-digit code to<br />
          <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#FA6E80] transition-colors disabled:opacity-50"
              />
            ))}
          </div>

          {/* Security Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-amber-800">
              Never share this code with anyone. Our team will never ask for this code.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isOtpComplete || loading}
            className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all transform hover:scale-[1.02] ${
              isOtpComplete && !loading
                ? 'bg-[#FA6E80] hover:bg-[#ff5a75] cursor-pointer shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          {resendCooldown > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend OTP in <span className="font-semibold text-[#FA6E80]">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              onClick={resendOTP}
              disabled={loading}
              className="text-[#FA6E80] hover:underline text-sm font-medium disabled:opacity-50 transition-all"
            >
              Didn't receive the code? Resend
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
