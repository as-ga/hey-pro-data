# Supabase Integration Guide for HeyProData

This guide provides quick reference for developers working with Supabase in the HeyProData project.

---

## 🚀 Quick Start

### Import Supabase Client
```typescript
// For browser/client components
import { supabase } from '@/lib/supabase/client';

// For API routes/server
import { createServerClient } from '@/lib/supabase/server';
```

### Use Authentication Hook
```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Hello {user.email}</div>;
}
```

---

## 🔐 Authentication Patterns

### 1. Email/Password Sign Up
```typescript
import { supabase, setStoragePreference } from '@/lib/supabase/client';

async function signUp(email: string, password: string, keepLoggedIn: boolean) {
  // Set storage preference
  setStoragePreference(keepLoggedIn);
  
  // Sign up
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password: password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Sign up error:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
```

### 2. Email/Password Login
```typescript
import { supabase, setStoragePreference } from '@/lib/supabase/client';

async function login(email: string, password: string, keepLoggedIn: boolean) {
  // Set storage preference
  setStoragePreference(keepLoggedIn);
  
  // Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password: password
  });
  
  if (error) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
```

### 3. OTP Verification
```typescript
import { supabase } from '@/lib/supabase/client';

async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup' // or 'email' for login
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
```

### 4. Google OAuth
```typescript
import { supabase, setStoragePreference } from '@/lib/supabase/client';

async function signInWithGoogle() {
  // OAuth defaults to "keep logged in"
  setStoragePreference(true);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  
  if (error) {
    console.error('OAuth error:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
```

### 5. Password Reset
```typescript
import { supabase } from '@/lib/supabase/client';

// Request password reset
async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.toLowerCase().trim(),
    {
      redirectTo: `${window.location.origin}/auth/reset-password`
    }
  );
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Update password
async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
```

### 6. Sign Out
```typescript
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useAuth();
  
  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  );
}

// Or directly
import { supabase } from '@/lib/supabase/client';

async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('heyprodata-keep-logged-in');
  sessionStorage.removeItem('heyprodata-keep-logged-in');
}
```

---

## 🔑 Getting Access Token

### Method 1: From Session
```typescript
import { supabase } from '@/lib/supabase/client';

const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### Method 2: Helper Function
```typescript
import { getAccessToken } from '@/lib/supabase/client';

const token = await getAccessToken();
```

### Method 3: In API Calls
```typescript
import { supabase } from '@/lib/supabase/client';

async function fetchProtectedData() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

---

## 📡 API Route Patterns

### Protected API Route
```typescript
// app/api/profile/route.ts
import { getUserFromRequest, successResponse, errorResponse } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Validate authentication
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return Response.json(
      errorResponse('Authentication required'),
      { status: 401 }
    );
  }
  
  // Fetch user profile
  try {
    const profile = await fetchUserProfile(user.id);
    return Response.json(successResponse(profile));
  } catch (error) {
    return Response.json(
      errorResponse('Failed to fetch profile'),
      { status: 500 }
    );
  }
}
```

### Public API Route
```typescript
// app/api/gigs/route.ts
import { successResponse, errorResponse } from '@/lib/supabase/server';

export async function GET() {
  try {
    const gigs = await fetchPublicGigs();
    return Response.json(successResponse(gigs));
  } catch (error) {
    return Response.json(
      errorResponse('Failed to fetch gigs'),
      { status: 500 }
    );
  }
}
```

---

## 🛡️ Protected Routes (Client-side)

### Using useAuth Hook
```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

### Reusable Auth Guard Component
```typescript
// components/AuthGuard.tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
}

// Usage
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

---

## 🔄 Auth State Listener

### Listen to Auth Changes
```typescript
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function MyComponent() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return <div>{user?.email}</div>;
}
```

---

## 📝 Database Queries

### Fetch User Profile
```typescript
import { supabase } from '@/lib/supabase/client';

async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}
```

### Update User Profile
```typescript
import { supabase } from '@/lib/supabase/client';

async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
```

---

## 📤 File Upload

### Upload Profile Photo
```typescript
import { supabase } from '@/lib/supabase/client';

async function uploadProfilePhoto(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;
  const filePath = `profile-photos/${fileName}`;
  
  // Upload file
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);
  
  return { success: true, url: publicUrl };
}
```

---

## 🧪 Testing Helpers

### Check if User is Authenticated
```typescript
import { supabase } from '@/lib/supabase/client';

async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
```

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/supabase/client';

const user = await getCurrentUser();
if (user) {
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
}
```

---

## ⚠️ Error Handling

### Standard Error Pattern
```typescript
import { supabase } from '@/lib/supabase/client';

async function performAction() {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*');
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Action failed:', error.message);
    return { success: false, error: error.message };
  }
}
```

---

## 📚 Useful Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JS Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

**Last Updated:** January 2025  
**Version:** 1.0.0
