'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, setStoragePreference } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from the URL
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session (PKCE flow)
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            setError(exchangeError.message)
            setTimeout(() => {
              router.push('/auth/login?error=authentication_failed')
            }, 2000)
            return
          }

          if (data.session) {
            // OAuth logins default to "keep me logged in"
            setStoragePreference(true)
            
            // Mark auth as verified for this session
            sessionStorage.setItem('heyprodata-auth-verified', 'true')
            
            // Check profile and redirect - don't let errors bubble up
            await checkProfileAndRedirect(data.session.user.id)
          } else {
            router.push('/auth/login')
          }
        } else {
          // No code in URL, check if there's an existing session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error('Error getting session:', sessionError)
            setError(sessionError.message)
            setTimeout(() => {
              router.push('/auth/login?error=authentication_failed')
            }, 2000)
            return
          }

          if (session) {
            // OAuth logins default to "keep me logged in"
            setStoragePreference(true)
            
            // Mark auth as verified for this session
            sessionStorage.setItem('heyprodata-auth-verified', 'true')
            
            // Check profile and redirect - don't let errors bubble up
            await checkProfileAndRedirect(session.user.id)
          } else {
            router.push('/auth/login')
          }
        }
      } catch (error) {
        // Only show error if we haven't already started redirecting
        if (!isRedirecting) {
          console.error('Callback error:', error)
          setError(error.message || 'Authentication failed')
          setTimeout(() => {
            router.push('/auth/login?error=authentication_failed')
          }, 2000)
        }
      }
    }

    // Separate function to check profile and redirect
    // This ensures profile errors don't bubble up to the main try-catch
    const checkProfileAndRedirect = async (userId) => {
      try {
        setIsRedirecting(true)
        
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        // Only log actual database errors, not "no rows" cases
        if (profileError && profileError.code !== 'PGRST116') {
          console.log('Profile check error (non-blocking):', profileError)
        }

        // If no profile exists, redirect to form page
        // Treat any error as "no profile" to avoid blocking user flow
        if (!profile) {
          router.push('/auth/form')
        } else {
          router.push('/home')
        }
      } catch (profileCheckError) {
        // If profile check fails entirely, assume no profile and continue
        // This is a non-blocking error - authentication succeeded
        console.log('Profile check exception (non-blocking):', profileCheckError)
        router.push('/auth/form')
      }
    }

    handleCallback()
  }, [router, searchParams, isRedirecting])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        {error ? (
          <>
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-medium mb-2">Authentication Error</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <p className="text-gray-500 text-xs mt-4">Redirecting to login page...</p>
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA6E80] mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we complete your sign in</p>
          </>
        )}
      </div>
    </div>
  )
}
