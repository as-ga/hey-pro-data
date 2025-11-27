"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Google } from "@/components/icons";
import Link from "next/link";
import { supabase, setStoragePreference } from "@/lib/supabase/client";

interface Errors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!email.trim()) {
      newErrors.email = "Please fill this field";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Please fill this field";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Set storage preference based on "Keep me logged in" checkbox
      setStoragePreference(keepLoggedIn);

      // Sign in with Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });

      if (loginError) {
        toast.error("Invalid email or password");
        console.error("Login error:", loginError);
        return;
      }

      // Get session token
      const token = data.session?.access_token;

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      // Check if profile exists and is complete
      const profileResponse = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const profileData = await profileResponse.json();

      if (profileData.success && profileData.data) {
        // Profile exists and is complete
        toast.success("Login successful!");
        router.push('/home');
      } else {
        // No profile or incomplete profile - redirect to profile form
        router.push('/form');
      }

    } catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
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
      toast.error("Google login failed");
      console.error('Google login error:', err);
    }
  };

  const handleAppleAuth = () => {
    toast.info("Apple authentication will be available soon");
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

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-start px-4 sm:px-6 md:pl-0 py-6 md:py-12 bg-white">
        <div className="w-full max-w-md md:max-w-lg md:pl-12 lg:pl-16 xl:pl-20">
          {/* Logo */}
          <div className="mb-6 md:mb-12 md:text-left text-center">
            <Image
              src="https://customer-assets.emergentagent.com/job_2a9bf250-13c7-456d-9a61-1240d767c09d/artifacts/97u04lh8_hpd.png"
              alt="HeyProData"
              width={200}
              height={60}
              className="h-14 md:h-12 mb-4 md:mb-8 w-auto mx-auto md:mx-0 "
            />
            <p className="text-2xl md:text-3xl font-light text-gray-900">Login to HeyProData</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-2 md:space-y-3">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm md:text-base font-medium text-gray-900"
              >
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
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] transition-all duration-300"
              />
              {errors.email && (
                <p className="text-xs md:text-sm text-red-500 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm md:text-base font-medium text-gray-900"
              >
                Password
              </label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] transition-all duration-300"
              />
              {errors.password && (
                <p className="text-xs md:text-sm text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Keep Logged In Checkbox */}
            <div className="flex items-center justify-between">
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
              <Link
                href="/forget-password"
                className="text-xs md:text-sm text-[#4A90E2] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px] transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 md:my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 md:px-4 text-gray-500 text-xs md:text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col w-full gap-3 md:gap-4 justify-center">
            <Button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className=" h-[45px] md:h-[40px] bg-white border border-gray-300 rounded-[12px] md:rounded-[15px] hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center p-3 md:p-6"
            >
              <Google className="" size={700} />
            </Button>

            <Button
              type="button"
              onClick={handleAppleAuth}
              disabled={isLoading}
              className=" h-[45px] md:h-[40px] bg-white border border-gray-300 rounded-[12px] md:rounded-[15px] hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center p-3 md:p-6"
            >
              <Apple className="" size={700} />
            </Button>
          </div>

          {/* Sign up Link */}
          <div className="text-center mt-5 md:mt-8">
            <span className="text-gray-600 text-xs md:text-base">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-[#4A90E2] font-medium hover:underline transition-all duration-200 text-xs md:text-base bg-transparent shadow-none hover:shadow-none"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
