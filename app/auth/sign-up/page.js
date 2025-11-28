'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, setStoragePreference } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // User is already logged in, redirect immediately
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle()

          // Mark auth as verified for this session
          sessionStorage.setItem('heyprodata-auth-verified', 'true')

          if (profile) {
            router.replace('/home')
          } else {
            router.replace('/auth/form')
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }
    checkUser()
  }, [router])

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  })

  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setFormData({ ...formData, password: newPassword })
    validatePassword(newPassword)
  }

  const isPasswordValid = () => {
    return (
      passwordValidation.minLength &&
      passwordValidation.hasUppercase &&
      passwordValidation.hasNumber &&
      passwordValidation.hasSpecialChar
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isPasswordValid()) {
      setError('Please ensure your password meets all requirements')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Normalize email to lowercase
      const normalizedEmail = formData.email.toLowerCase().trim()

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail
      ? null 
      : await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('user_id', (await supabase.auth.getUser()).data?.user?.id)
          .maybeSingle()

      // Sign up with email and password - this will send OTP code to email
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          // No emailRedirectTo - this ensures OTP code is sent instead of magic link
          data: {
            email: normalizedEmail
          }
        }
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setError('This email is already registered. Please login instead or use a different email.')
        } else if (error.message.includes('Email rate limit exceeded')) {
          setError('Too many signup attempts. Please try again in a few minutes.')
        } else {
          setError(error.message)
        }
        setLoading(false)
        return
      }

      // If user already exists (identities array is empty), show appropriate message
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('This email is already registered. Please login instead.')
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required - redirect to OTP page
        router.push(`/auth/otp?email=${encodeURIComponent(normalizedEmail)}&type=signup`)
      } else if (data.session) {
        // Auto-confirmed (disabled email confirmation) - go directly to form
        router.push('/auth/form')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')

    try {
      // Google OAuth defaults to "keep me logged in"
      setStoragePreference(true)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIGN UP PART */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <img src="/logo/logo.svg" alt="Logo" width="60" className="mb-8" />
          </div>

          <h2 className="text-3xl font-medium mb-8">
            Sign up to <span className="text-gray-900">HeyPro</span><span className="text-[#00bcd4]">Data</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                required
                disabled={loading}
              />
            </div>

            {!isPasswordValid() && formData.password.length > 0 && (
              <div className="mb-6 text-sm text-gray-600">
                Password must contain a minimum of 8 characters, 1 upper case, 1 number and 1 special character.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isPasswordValid()}
              className="w-full bg-[#ff6b9d] hover:bg-[#ff5a8f] text-white py-3 rounded-lg font-medium mb-6 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/assets/google-icon.png" width="22" alt="Google" />
              Google
            </button>
            <button 
              disabled
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
            >
              <img src="/assets/apple-icon.png" width="20" alt="Apple" />
              Apple
            </button>
          </div>

          <div className="text-center text-sm">
            Already have an account? <Link href="/auth/login" className="text-[#0066ff] hover:underline">Login</Link>
          </div>
        </div>
      </div>

      {/* RIGHT GRADIENT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="w-full h-full rounded-3xl" style={{background: 'conic-gradient(from 180deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)'}}></div>
      </div>
    </div>
  )
}
