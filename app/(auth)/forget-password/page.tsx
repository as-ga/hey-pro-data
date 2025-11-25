'use client';

import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      const normalizedEmail = email.toLowerCase().trim();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (resetError) {
        setError(resetError.message);
        console.error('Password reset error:', resetError);
        return;
      }

      setSuccess(true);
      toast.success('Password reset link sent!');

    } catch (err) {
      setError('Failed to send reset link. Please try again.');
      console.error('Reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side - Gradient Background */}
      <div className="hidden md:flex md:w-1/2 items-center justify-end pl-8 pr-0 py-8">
        <div
          className="w-full h-full max-w-[450px] max-h-[721px] rounded-[68px]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)",
          }}
        ></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-start px-4 sm:px-6 md:pl-0 py-6 md:py-12 bg-white">
        <div className="w-full max-w-md md:max-w-lg md:pl-12 lg:pl-16 xl:pl-20">
          {/* Logo */}
          <div className="mb-6 md:mb-12 md:text-left text-center">
            <Image
              src="https://customer-assets.emergentagent.com/job_2a9bf250-13c7-456d-9a61-1240d767c09d/artifacts/97u04lh8_hpd.png"
              alt="HeyProData"
              width={200}
              height={60}
              className="h-14 md:h-12 mb-4 md:mb-8 w-auto mx-auto md:mx-0"
            />
            <p className="text-2xl md:text-3xl font-light text-gray-900">
              {success ? 'Check Your Email' : 'Forgot Password?'}
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              {success 
                ? "We've sent you a password reset link" 
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  A password reset link has been sent to <span className="font-semibold">{email}</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder.
                </p>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-[#4A90E2] hover:underline bg-transparent shadow-none hover:shadow-none"
                >
                  Try another email
                </Button>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/login"
                  className="text-[#4A90E2] font-medium hover:underline text-sm md:text-base"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm md:text-base font-medium text-gray-900"
                >
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
                  required
                />
                {error && (
                  <p className="text-xs md:text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px] transition-all duration-300"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center mt-6">
                <span className="text-gray-600 text-xs md:text-base">
                  Remember your password?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-[#4A90E2] font-medium hover:underline text-xs md:text-base"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
