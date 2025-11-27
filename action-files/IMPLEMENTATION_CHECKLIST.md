# API Implementation Checklist

Quick reference checklist for implementing placeholder routes.

---

## 🔴 Phase 1: High Priority (Core Functionality)

### Explore & Discovery

- [ ] **GET** `/api/explore` - Crew directory with filters
  - Action File: `action-files/explore-route-implementation.ts`
  - Database: `user_profiles`, `user_roles`
  - Estimated Time: 1-2 hours

- [ ] **GET** `/api/explore/[userId]` - User profile details
  - Pattern: Follow `/api/gigs/[id]` pattern
  - Database: `user_profiles` + all related tables
  - Estimated Time: 1 hour

- [ ] **GET** `/api/explore/categories` - Unique role categories
  - Simple query: `SELECT DISTINCT role_name FROM user_roles`
  - Estimated Time: 15 minutes

### Notifications

- [ ] **GET** `/api/notifications` - User notifications list
  - Action File: `action-files/notifications-route-implementation.ts`
  - Database: `notifications`
  - Estimated Time: 1 hour

- [ ] **PATCH** `/api/notifications/[id]/read` - Mark as read
  - Simple update query
  - Estimated Time: 15 minutes

- [ ] **POST** `/api/notifications/mark-all-read` - Mark all read
  - Batch update query
  - Estimated Time: 15 minutes

---

## 🟡 Phase 2: Medium Priority (Profile Features)

### Skills Management

- [ ] **GET** `/api/skills` - Get user skills
  - Action File: `action-files/skills-route-implementation.ts`
  - Database: `applicant_skills` or `user_skills`
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/skills` - Add skill
  - Action File: `action-files/skills-route-implementation.ts`
  - Handle unique constraint
  - Estimated Time: 30 minutes

- [ ] **PATCH** `/api/skills/[id]` - Update skill
  - Update proficiency/sort_order
  - Estimated Time: 20 minutes

- [ ] **DELETE** `/api/skills/[id]` - Delete skill
  - Simple delete query
  - Estimated Time: 15 minutes

### Availability Calendar

- [ ] **GET** `/api/availability` - Get availability
  - Action File: `action-files/availability-route-implementation.ts`
  - Database: `crew_availability`
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/availability` - Set availability
  - Action File: `action-files/availability-route-implementation.ts`
  - Use upsert for duplicates
  - Estimated Time: 30 minutes

- [ ] **PATCH** `/api/availability/[id]` - Update availability
  - Simple update query
  - Estimated Time: 20 minutes

- [ ] **GET** `/api/availability/check` - Check conflicts
  - Date range query
  - Estimated Time: 30 minutes

---

## 🟢 Phase 3: Low Priority (Additional Features)

### Contacts Management

- [ ] **POST** `/api/contacts` - Add contact
  - Database: `crew_contacts`
  - Verify gig ownership
  - Estimated Time: 30 minutes

- [ ] **GET** `/api/contacts/gig/[gigId]` - Get gig contacts
  - Simple fetch query
  - Estimated Time: 20 minutes

- [ ] **DELETE** `/api/contacts/[id]` - Delete contact
  - Verify ownership
  - Estimated Time: 20 minutes

### Referrals

- [ ] **GET** `/api/referrals` - Get referrals
  - Database: `referrals`
  - Both sent and received
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/referrals` - Create referral
  - Create notification
  - Estimated Time: 45 minutes

---

## 📤 Phase 4: File Upload Endpoints

### Upload Routes (All follow same template)

- [ ] **POST** `/api/upload/profile-photo`
  - Template: `action-files/upload-template.ts`
  - Bucket: `profile-photos/`, Max: 2MB
  - Types: JPEG, PNG, WebP
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/upload/portfolio`
  - Template: `action-files/upload-template.ts`
  - Bucket: `portfolios/` (private), Max: 10MB
  - Types: PDF, Images, Videos
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/upload/slate-media`
  - Template: `action-files/upload-template.ts`
  - Bucket: `slate-media/`, Max: 10MB
  - Types: Images, Videos
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/upload/resume`
  - Template: `action-files/upload-template.ts`
  - Bucket: `resumes/` (private), Max: 5MB
  - Types: PDF, DOC, DOCX
  - Estimated Time: 30 minutes

- [ ] **POST** `/api/upload/project-asset`
  - Template: `action-files/upload-template.ts`
  - Bucket: `project-assets/`, Max: 20MB
  - Types: All media/documents
  - Estimated Time: 30 minutes

---

## 📊 Overall Progress

**Total Routes:** 21
- Phase 1: 6 routes (4-6 hours)
- Phase 2: 8 routes (3-4 hours)
- Phase 3: 2 routes (1-2 hours)
- Phase 4: 5 routes (2-3 hours)

**Total Estimated Time:** 10-15 hours

---

## ✅ Implementation Checklist for Each Route

When implementing a route, verify:

1. [ ] Copied correct action file or followed pattern
2. [ ] Database table names match schema
3. [ ] Column names are correct
4. [ ] Query parameters validated
5. [ ] Request body validated
6. [ ] Error handling implemented
7. [ ] Success response formatted correctly
8. [ ] Tested with sample data
9. [ ] Updated API_DOC.md status (⏳ → ✅)
10. [ ] Committed changes

---

## 🎯 Quick Implementation Steps

### For Each Route:

1. **Open the placeholder file**
   ```bash
   # Example
   code /app/api/explore/route.ts
   ```

2. **Copy implementation**
   - From action file if available
   - Or follow similar implemented route

3. **Customize for your schema**
   - Update table names
   - Update column names
   - Adjust query logic

4. **Test the route**
   ```bash
   curl -X GET "http://localhost:3000/api/explore"
   ```

5. **Update documentation**
   - Mark as ✅ in API_DOC.md
   - Update this checklist

---

## 🔍 Testing Commands

```bash
# Explore
curl -X GET "http://localhost:3000/api/explore?keyword=camera"

# Notifications
curl -X GET "http://localhost:3000/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Skills
curl -X GET "http://localhost:3000/api/skills" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Availability
curl -X GET "http://localhost:3000/api/availability?month=2025-02" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add Skill
curl -X POST "http://localhost:3000/api/skills" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skill_name": "Adobe Premiere Pro", "proficiency_level": "Expert"}'

# Set Availability
curl -X POST "http://localhost:3000/api/availability" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"availability_date": "2025-02-15", "status": "available"}'
```

---

## 📚 Reference Files

- **Guide:** `/app/API_IMPLEMENTATION_PLACEHOLDER_GUIDE.md`
- **Documentation:** `/app/API_DOC.md`
- **Action Files:** `/app/action-files/`
- **Examples:** 
  - `/app/api/gigs/route.ts` (GET with filters)
  - `/app/api/profile/route.ts` (GET/PATCH)
  - `/app/api/slate/route.ts` (Social feed)
  - `/app/api/upload/collab-cover/route.ts` (File upload)

---

## 🚀 Get Started!

1. Start with Phase 1 (High Priority)
2. Use action files when available
3. Follow the implementation pattern
4. Test each route before moving to next
5. Update documentation as you go

**Let's build! 💪**
