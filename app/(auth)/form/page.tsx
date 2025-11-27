'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  legal_first_name: string;
  legal_surname: string;
  alias_first_name: string;
  alias_surname: string;
  country: string;
  city: string;
}

const countries = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Egypt',
  'Jordan',
  'Lebanon',
  'Morocco',
  'Tunisia',
  'Algeria',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Pakistan',
  'Bangladesh',
  'Other'
];

export default function ProfileFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    legal_first_name: '',
    legal_surname: '',
    alias_first_name: '',
    alias_surname: '',
    country: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = () => {
    return formData.legal_first_name.trim() &&
           formData.legal_surname.trim() &&
           formData.country &&
           formData.city.trim();
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isFormValid()) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError('Not authenticated');
        router.push('/login');
        return;
      }

      // Create/update profile via API
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create profile');
        return;
      }

      toast.success('Profile created successfully!');
      // Redirect to home
      router.push('/home');

    } catch (err) {
      setError('An error occurred while creating your profile');
      console.error('Profile creation error:', err);
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
          <div className="mb-6 md:mb-8 md:text-left text-center">
            <Image
              src="https://customer-assets.emergentagent.com/job_2a9bf250-13c7-456d-9a61-1240d767c09d/artifacts/97u04lh8_hpd.png"
              alt="HeyProData"
              width={200}
              height={60}
              className="h-14 md:h-12 mb-4 md:mb-6 w-auto mx-auto md:mx-0"
            />
            <p className="text-2xl md:text-3xl font-light text-gray-900">
              Complete Your Profile
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Tell us a bit about yourself
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Legal First Name */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={formData.legal_first_name}
                onChange={(e) => handleChange('legal_first_name', e.target.value)}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
                required
              />
            </div>

            {/* Legal Surname */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                Surname <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your surname"
                value={formData.legal_surname}
                onChange={(e) => handleChange('legal_surname', e.target.value)}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
                required
              />
            </div>

            {/* Alias First Name (Optional) */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                Alias First Name <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="Stage/professional name"
                value={formData.alias_first_name}
                onChange={(e) => handleChange('alias_first_name', e.target.value)}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
              />
            </div>

            {/* Alias Surname (Optional) */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                Alias Surname <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="Stage/professional surname"
                value={formData.alias_surname}
                onChange={(e) => handleChange('alias_surname', e.target.value)}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full h-11 md:h-12 text-sm md:text-base border border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80] px-3 bg-white"
                required
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-900">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="h-11 md:h-12 text-sm md:text-base border-gray-300 rounded-xl focus:border-[#FA6E80] focus:ring-[#FA6E80]"
                required
              />
            </div>

            {error && (
              <p className="text-xs md:text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px] transition-all duration-300 mt-6"
            >
              {loading ? 'Creating Profile...' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
