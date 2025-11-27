'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp.concat(Array(6 - newOtp.length).fill('')));

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 6) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });

      if (verifyError) {
        setError('Invalid or expired verification code');
        console.error('OTP verification error:', verifyError);
        return;
      }

      // Check if profile exists
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError('Authentication failed');
        return;
      }

      const profileResponse = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const profileData = await profileResponse.json();

      toast.success('Email verified successfully!');

      if (profileData.success && profileData.data) {
        // Profile exists, go to home
        router.push('/home');
      } else {
        // No profile, go to profile creation form
        router.push('/form');
      }

    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error('Failed to resend code');
        console.error('Resend error:', error);
        return;
      }

      toast.success('Verification code resent!');
      setResendTimer(60);
    } catch (err) {
      toast.error('Failed to resend code');
      console.error('Resend error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10 sm:py-14">
      <div
        className="relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-[36px] sm:rounded-[48px] md:rounded-[60px] lg:rounded-[68px] flex items-center justify-center p-4 sm:p-6 md:p-10"
        style={{
          backgroundImage:
            "conic-gradient(from 180deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)",
          backgroundSize: "140% 140%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/85 backdrop-blur-sm w-full max-w-md rounded-2xl p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6 shadow-lg"
        >
          <div className="text-center mb-2 sm:mb-4">
            <Image
              src="https://customer-assets.emergentagent.com/job_2a9bf250-13c7-456d-9a61-1240d767c09d/artifacts/97u04lh8_hpd.png"
              alt="HeyProData"
              width={180}
              height={56}
              className="h-10 sm:h-12 md:h-14 w-auto mx-auto"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 text-center">
            Enter Your OTP
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
            We sent a 6‑digit code to <span className="font-medium break-all">{email}</span>. <br className="hidden sm:block" />
            Enter it below to continue.
          </p>

          <div>
            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-base sm:text-lg font-medium border-gray-300 focus:border-[#FA6E80] focus:ring-[#FA6E80] bg-gray-100 rounded-lg"
                />
              ))}
            </div>
            {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
            <p className="text-[10px] sm:text-xs mt-3 text-gray-500 text-center px-2">
              ⚠️ Didn&apos;t receive the code? Do not share your OTP with anyone.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full h-11 sm:h-12 bg-[#FA6E80] hover:bg-[#f95569] text-white font-medium rounded-xl sm:rounded-[15px] text-sm sm:text-base"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between text-xs sm:text-sm text-gray-600">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={`font-medium ${
                resendTimer > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-[#4A90E2] hover:underline'
              }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-[#4A90E2] hover:underline font-medium"
            >
              Change Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}
