import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken, successResponse, errorResponse } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = await validateAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        errorResponse('Authentication required'),
        { status: 401 }
      );
    }

    // Get profile from database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // Profile doesn't exist yet - return null data
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          successResponse(null, 'No profile found'),
          { status: 200 }
        );
      }
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        errorResponse('Failed to fetch profile', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      successResponse(profile, 'Profile retrieved successfully'),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', error.message),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Create or update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = await validateAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        errorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields for profile creation
    const requiredFields = ['legal_first_name', 'legal_surname', 'country', 'city'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        errorResponse(`Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
          errorResponse('Failed to update profile', error.message),
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        return NextResponse.json(
          errorResponse('Failed to create profile', error.message),
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json(
      successResponse(result, 'Profile saved successfully'),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', error.message),
      { status: 500 }
    );
  }
}
