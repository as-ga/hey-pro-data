"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Apple, Google } from "@/components/icons";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase, setStoragePreference } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

interface PasswordValidation {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

interface Errors {
  email?: string;
  password?: string;
}

const validatePassword = (password: string): PasswordValidation => ({
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  hasMinLength: password.length >= 8,
});

const SignUp: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!email.trim()) {
      newErrors.email = "Please fill this field";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Please fill this field";
    } else if (!passwordValidation.hasUppercase || 
               !passwordValidation.hasNumber || 
               !passwordValidation.hasSpecialChar ||
               !passwordValidation.hasMinLength) {
      newErrors.password = "Password does not meet all requirements";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Set storage preference
      setStoragePreference(keepLoggedIn);

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in.');
        } else {
          toast.error(signUpError.message);
        }
        console.error('Sign up error:', signUpError);
        return;
      }

      // Redirect to OTP verification page
      toast.success('Verification code sent to your email!');
      router.push(`/otp?email=${encodeURIComponent(normalizedEmail)}`);

    } catch (err) {
      toast.error('Sign up failed. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Set storage preference to keep logged in for OAuth
      setStoragePreference(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        toast.error("Google authentication failed");
        console.error('OAuth error:', error);
      }
    } catch (err) {
      toast.error("Google sign up failed");
      console.error('Google auth error:', err);
    }
  };

  const handleAppleAuth = () => {
    toast.info("Apple authentication will be available soon");
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-start px-4 sm:px-6 md:pl-0 py-6 md:py-12 bg-white mx-auto">
        <div className="flex w-full flex-col md:flex-row gap-8">
          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center py-6 md:py-0">
            <div
              className="w-full h-64 md:h-[600px] max-w-[450px] md:max-h-[721px] rounded-[40px] md:rounded-[68px]"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)",
              }}
            ></div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <form onSubmit={handleSignUp} className="space-y-2 md:space-y-3">
              <div className="mb-6 md:mb-12 md:text-left text-center">
                <Image
                  src="https://customer-assets.emergentagent.com/job_2a9bf250-13c7-456d-9a61-1240d767c09d/artifacts/97u04lh8_hpd.png"
                  alt="HeyProData"
                  width={200}
                  height={60}
                  className="h-14 md:h-12 mb-4 md:mb-8 w-auto mx-auto md:mx-0"
                />
                <p className="text-2xl md:text-3xl font-light text-gray-900">
                  Sign up to HeyProData
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
                />
                {errors.email && <p className="text-xs md:text-sm text-red-500 mt-2">{errors.email}</p>}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="text-xs md:text-sm text-red-500 mt-2">{errors.password}</p>}
              </div>

              {password && (
                <div className="space-y-1.5 md:space-y-2">
                  <PasswordRule label="at least 8 characters" valid={passwordValidation.hasMinLength} />
                  <PasswordRule label="at least one uppercase" valid={passwordValidation.hasUppercase} />
                  <PasswordRule label="at least one number" valid={passwordValidation.hasNumber} />
                  <PasswordRule label="at least one special character" valid={passwordValidation.hasSpecialChar} />
                </div>
              )}

              {/* Keep Logged In Checkbox */}
              <div className="flex items-center space-x-2 md:space-x-3">
                <Checkbox
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) =>
                    setKeepLoggedIn(checked as boolean)
                  }
                  className="border-gray-400 data-[state=checked]:bg-[#FA6E80] data-[state=checked]:border-[#FA6E80]"
                />
                <label
                  htmlFor="keepLoggedIn"
                  className="text-xs md:text-sm text-gray-600 cursor-pointer select-none"
                >
                  Keep me logged in
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px]"
              >
                {isLoading ? "Loading..." : "Sign up"}
              </Button>
            </form>

            <Divider label="or" />

            <div className="flex flex-col w-full gap-2 md:gap-4 justify-center">
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="h-[45px] md:h-[40px] bg-white border border-gray-300 rounded-[12px] md:rounded-[15px] hover:bg-gray-50"
              >
                <Google size={700} />
              </Button>
              <Button
                type="button"
                onClick={handleAppleAuth}
                disabled={isLoading}
                className="h-[45px] md:h-[40px] bg-white border border-gray-300 rounded-[12px] md:rounded-[15px] hover:bg-gray-50"
              >
                <Apple size={700} />
              </Button>
            </div>

            <div className="text-center mt-5 md:mt-8">
              <span className="text-gray-600 text-xs md:text-base">Already have an account? </span>
              <Link href="/login" className="text-[#4A90E2] font-medium hover:underline text-xs md:text-base">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const Divider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center my-5 md:my-8">
    <div className="flex-1 border-t border-gray-300"></div>
    <span className="px-3 md:px-4 text-gray-500 text-xs md:text-sm">{label}</span>
    <div className="flex-1 border-t border-gray-300"></div>
  </div>
);

export default SignUp;
