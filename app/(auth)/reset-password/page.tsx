'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordValidation {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

const validatePassword = (password: string): PasswordValidation => ({
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  hasMinLength: password.length >= 8,
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  useEffect(() => {
    if (password) {
      setPasswordValidation(validatePassword(password));
    } else {
      setPasswordValidation({ 
        hasUppercase: false, 
        hasNumber: false, 
        hasSpecialChar: false,
        hasMinLength: false 
      });
    }
  }, [password]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password
    if (!password.trim()) {
      setError('Please enter a new password');
      setLoading(false);
      return;
    }

    if (!passwordValidation.hasUppercase || 
        !passwordValidation.hasNumber || 
        !passwordValidation.hasSpecialChar ||
        !passwordValidation.hasMinLength) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
        console.error('Password update error:', updateError);
        return;
      }

      toast.success('Password reset successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Reset password error:', err);
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
              Reset Your Password
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm md:text-base font-medium text-gray-900"
              >
                New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Validation */}
            {password && (
              <div className="space-y-1.5 md:space-y-2">
                <PasswordRule label="at least 8 characters" valid={passwordValidation.hasMinLength} />
                <PasswordRule label="at least one uppercase" valid={passwordValidation.hasUppercase} />
                <PasswordRule label="at least one number" valid={passwordValidation.hasNumber} />
                <PasswordRule label="at least one special character" valid={passwordValidation.hasSpecialChar} />
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm md:text-base font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <p className="text-xs md:text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px] transition-all duration-300"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

interface PasswordRuleProps {
  label: string;
  valid: boolean;
}

const PasswordRule: React.FC<PasswordRuleProps> = ({ label, valid }) => (
  <div className="flex items-center space-x-2">
    <div
      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
        valid ? "bg-green-500" : "bg-gray-400"
      }`}
    ></div>
    <span
      className={`text-[10px] md:text-sm ${
        valid ? "text-green-500" : "text-gray-500"
      }`}
    >
      Password must contain <span className="font-medium">{label}</span>
    </span>
  </div>
);
