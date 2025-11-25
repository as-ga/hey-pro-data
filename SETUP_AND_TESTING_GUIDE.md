# Phase 2 Setup and Testing Guide

Complete guide to set up and test the authentication system.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure Supabase Database

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to SQL Editor** (left sidebar)
3. **Run the setup script**:
   - Open `/app/supabase_setup.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click "Run"

### Step 2: Configure Google OAuth

1. **Open Supabase Dashboard** → Authentication → Providers
2. **Find "Google" provider**
3. **Toggle to enable it**
4. **Add credentials**:
5. **Save changes**

### Step 3: Configure Google Cloud Console

4. **Save**

### Step 4: Configure Supabase URLs

1. **In Supabase Dashboard** → Authentication → URL Configuration
2. **Set Site URL**: `http://localhost:3000` (for development)
3. **Add Redirect URLs**: `http://localhost:3000/callback`
4. **Save**

### Step 5: Start the Development Server

```bash
cd /app
yarn dev
```

---

## ✅ Testing Checklist

### Test 1: Email/Password Sign-up Flow

1. **Navigate to**: http://localhost:3000/signup
2. **Fill in the form**:
   - Email: your-test-email@example.com
   - Password: Test123!@# (meets all requirements)
   - Check "Keep me logged in" if desired
3. **Click "Sign up"**
4. **Expected**: Redirect to OTP page
5. **Check email** for verification code (6 digits)
6. **Enter OTP** on the verification page
7. **Expected**: Redirect to profile form (`/form`)
8. **Fill in profile**:
   - First Name: John
   - Surname: Doe
   - Country: United Arab Emirates
   - City: Dubai
   - (Alias fields are optional)
9. **Click "Continue"**
10. **Expected**: Redirect to `/home` (might show 404 if home page not created yet, but that's okay)

**✅ Success Criteria**:
- No errors during signup
- OTP received via email
- Profile created successfully
- User authenticated

---

### Test 2: Email/Password Login Flow

1. **Navigate to**: http://localhost:3000/login
2. **Fill in credentials**:
   - Email: your-test-email@example.com
   - Password: Test123!@#
3. **Check/uncheck "Keep me logged in"**
4. **Click "Login"**
5. **Expected**: Redirect to `/home`

**✅ Success Criteria**:
- Login successful
- No profile form shown (already completed)
- Redirected to home

---

### Test 3: "Keep Me Logged In" Feature

#### Test A: With checkbox checked
1. **Login with "Keep me logged in" checked**
2. **Close browser completely**
3. **Reopen browser and navigate to** http://localhost:3000/home
4. **Expected**: Still logged in, no redirect to login

#### Test B: Without checkbox
1. **Logout** (if logout button exists, or clear cookies manually)
2. **Login without checking "Keep me logged in"**
3. **Close browser completely**
4. **Reopen browser and navigate to** http://localhost:3000/home
5. **Expected**: Redirected to login (session not persisted)

**✅ Success Criteria**:
- Session persists when checkbox is checked
- Session clears when checkbox is not checked

---

### Test 4: Google OAuth Flow

1. **Navigate to**: http://localhost:3000/login
2. **Click "Continue with Google" button**
3. **Select Google account** and authorize
4. **Expected**: Redirect to `/callback` then to `/form` (first time)
5. **Fill in profile form**
6. **Click "Continue"**
7. **Expected**: Redirect to `/home`

**For subsequent logins**:
1. **Logout and click "Continue with Google" again**
2. **Expected**: Skip profile form, go directly to `/home`

**✅ Success Criteria**:
- OAuth flow completes successfully
- Profile form shown only on first login
- User authenticated via Google

---

### Test 5: Password Reset Flow

1. **Navigate to**: http://localhost:3000/login
2. **Click "Forgot password?"**
3. **Enter email**: your-test-email@example.com
4. **Click "Send Reset Link"**
5. **Check email** for reset link
6. **Click the reset link** in email
7. **Expected**: Redirect to `/reset-password`
8. **Enter new password**: NewTest123!@#
9. **Confirm password**: NewTest123!@#
10. **Click "Reset Password"**
11. **Expected**: Redirect to `/login` with success message
12. **Login with new password**
13. **Expected**: Login successful

**✅ Success Criteria**:
- Reset email received
- Password changed successfully
- Can login with new password

---

### Test 6: OTP Resend Functionality

1. **Start signup process** (don't verify OTP yet)
2. **On OTP page**, wait for timer to reach 0
3. **Click "Resend Code"**
4. **Expected**: New OTP sent to email
5. **Check email** for new code
6. **Enter new code**
7. **Expected**: Verification successful

**✅ Success Criteria**:
- Can resend OTP after timer expires
- New OTP works for verification

---

### Test 7: Protected Routes

1. **Make sure you're logged out** (clear cookies if needed)
2. **Try to access**: http://localhost:3000/home
3. **Expected**: Redirect to `/login?redirect=/home`
4. **Login successfully**
5. **Expected**: Redirect back to `/home`

**✅ Success Criteria**:
- Cannot access protected routes when logged out
- Redirected to login
- Redirect back to original page after login

---

### Test 8: Auth Routes When Logged In

1. **Make sure you're logged in**
2. **Try to access**: http://localhost:3000/login
3. **Expected**: Redirect to `/home`
4. **Try to access**: http://localhost:3000/signup
5. **Expected**: Redirect to `/home`

**✅ Success Criteria**:
- Cannot access login/signup when already authenticated
- Redirected to home

---

### Test 9: Profile API Endpoint

**Test GET (fetch profile)**:
```bash
# Get session token from browser DevTools → Application → Cookies
# Look for sb-kvidydsfnnrathhpuxye-auth-token

curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user_id": "...",
    "legal_first_name": "John",
    "legal_surname": "Doe",
    ...
  }
}
```

**Test PATCH (update profile)**:
```bash
curl -X PATCH http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio text",
    "city": "Abu Dhabi"
  }'
```

**✅ Success Criteria**:
- Can fetch profile with valid token
- Can update profile fields
- Returns 401 without token

---

### Test 10: Edge Cases

#### Invalid Email
1. **Try to signup with**: invalid-email
2. **Expected**: Validation error

#### Weak Password
1. **Try to signup with**: password123
2. **Expected**: Password validation errors shown

#### Already Registered Email
1. **Try to signup with existing email**
2. **Expected**: Error message "This email is already registered"

#### Invalid OTP
1. **Enter wrong OTP code**: 000000
2. **Expected**: "Invalid or expired verification code" error

#### Password Mismatch on Reset
1. **On reset password page**:
   - New Password: NewTest123!@#
   - Confirm Password: DifferentPass123!@#
2. **Expected**: "Passwords do not match" error

**✅ Success Criteria**:
- All validation errors displayed correctly
- No crashes or unexpected behavior

---

## 🐛 Troubleshooting

### Issue: "Invalid login credentials" on login

**Possible causes**:
1. Email not verified (check OTP was completed)
2. Wrong password
3. Account doesn't exist

**Solution**:
- Try password reset flow
- Check Supabase Dashboard → Authentication → Users to see if user exists

---

### Issue: "Authentication required" when accessing API

**Possible causes**:
1. Not logged in
2. Session expired
3. Invalid token

**Solution**:
- Check browser console for errors
- Clear cookies and login again
- Check token in cookies: `sb-kvidydsfnnrathhpuxye-auth-token`

---

### Issue: Google OAuth not working

**Possible causes**:
1. Google provider not enabled in Supabase
2. Wrong OAuth credentials
3. Redirect URL not configured

**Solution**:
1. Check Supabase Dashboard → Auth → Providers → Google is enabled
2. Verify client ID and secret are correct
3. Check redirect URLs in Google Cloud Console
4. Make sure `http://localhost:3000/callback` is whitelisted

---

### Issue: OTP email not received

**Possible causes**:
1. Email in spam folder
2. Supabase email service delay
3. Invalid email address

**Solution**:
- Check spam/junk folder
- Wait 2-3 minutes (Supabase can be slow)
- For development, check Supabase Dashboard → Authentication → Users to see recent signups
- Can manually verify user in Supabase if needed for testing

---

### Issue: Profile not saving

**Possible causes**:
1. Database table not created
2. Missing required fields
3. RLS policies blocking insert

**Solution**:
1. Run `/app/supabase_setup.sql` again
2. Check browser console for errors
3. Verify all required fields are filled
4. Check Supabase logs in Dashboard

---

### Issue: Middleware redirecting unexpectedly

**Possible causes**:
1. Session not being detected
2. Cookie issues
3. Route matching problems

**Solution**:
- Check browser cookies
- Clear all cookies and login fresh
- Check console for errors
- Verify `@supabase/ssr` is installed

---

## 📊 Success Metrics

After completing all tests, you should have:

- ✅ Email signup and login working
- ✅ OTP verification functional
- ✅ Google OAuth working
- ✅ Password reset working
- ✅ Profile creation working
- ✅ "Keep me logged in" working
- ✅ Protected routes working
- ✅ Auth routes redirecting properly
- ✅ Session management working
- ✅ API endpoint responding correctly

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Update Migration Roadmap**: Mark Phase 2 as complete
2. **Start Phase 4**: Implement remaining API endpoints
3. **Configure Production URLs**: Update redirect URLs for production
4. **Set up Custom SMTP**: Configure custom email server in Supabase for production
5. **Monitor**: Check Supabase Dashboard → Authentication logs for any issues

---

## 📞 Support

If you encounter any issues:

1. Check browser console for errors
2. Check Supabase Dashboard → Logs
3. Review this guide's troubleshooting section
4. Check `/app/PHASE_2_COMPLETE.md` for implementation details

---

**Last Updated**: January 2025
**Phase**: 2 - Authentication Implementation
**Status**: Ready for Testing
