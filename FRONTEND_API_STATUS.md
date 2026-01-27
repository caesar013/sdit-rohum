# Frontend API Integration Status

## Overview
This document tracks the connection between the Vue 3 frontend and the Express.js backend public APIs.

## API Service Layer
✅ **Created:** `src/services/api.js`
- Axios instance with base URL configuration
- Request/response interceptors for auth token management
- All public API methods implemented
- Error handling and response formatting

## Environment Configuration
✅ **Created:** `.env.example`
- Template for `VITE_API_BASE_URL` environment variable
- Default: `http://localhost:3000/api`

## Pages Connected to APIs

### ✅ News System
1. **Berita.vue** (News Listing)
   - Connected to: `GET /api/news`
   - Features implemented:
     - Pagination with `page` and `limit` params
     - Search functionality
     - Published news filter
     - Loading states
     - Error handling
     - Dynamic date formatting
     - Click navigation to detail page
   - API Methods: `getNews(params)`

2. **BeritaDetail.vue** (News Detail)
   - Connected to: `GET /api/news/slug/:slug`
   - Features implemented:
     - Fetch article by slug from route params
     - Related news fetching
     - Share functionality (Facebook, Twitter, WhatsApp)
     - Comment form (submission stub - pending backend)
     - Error redirect to news list
     - Dynamic navigation between articles
   - API Methods: `getNewsBySlug(slug)`, `getNews(params)`

### ✅ Contact System
3. **HubungiKami.vue** (Contact Page)
   - Connected to:
     - `POST /api/contact` (form submission)
     - `GET /api/school-profile/:key` (contact info)
   - Features implemented:
     - Contact form submission with validation
     - Dynamic contact info loading (phone, email, address, map)
     - WhatsApp integration
     - Google Maps integration
     - Social media links
     - Success/error messages
   - API Methods: `submitContact(data)`, `getSchoolProfileByKey(key)`

## Pages Pending API Connection

### 🔄 Directory Pages

4. **PesertaDidik.vue** (Student Directory)
   - API to connect: `GET /api/students`
   - Required params: `academic_year`, `grade`, `status`, `gender`, `page`, `limit`
   - Methods available: `getStudents(params)`, `getStudentStatuses()`
   - Status: Stubbed, ready for connection

5. **GuruTendik.vue** (Teacher Directory)
   - API to connect: `GET /api/teachers`
   - Required params: `status`, `search`, `page`, `limit`
   - Methods available: `getTeachers(params)`, `getTeacherById(id)`, `getTeacherStatuses()`
   - Status: Stubbed, ready for connection

6. **PDNonAktif.vue** (Alumni Directory)
   - API to connect: 
     - `GET /api/alumni` (list)
     - `POST /api/alumni` (self-registration)
     - `GET /api/alumni/graduation-years`
   - Required params: `graduation_year`, `gender`, `registration_status`, `page`, `limit`
   - Methods available: `getAlumni(params)`, `registerAlumni(formData)`, `getAlumniGraduationYears()`
   - Status: Stubbed, ready for connection
   - Note: Photo upload uses multipart/form-data

### 🔄 Gallery Pages

7. **GaleriFoto.vue** (Photo Gallery)
   - API to connect: `GET /api/gallery`, `GET /api/gallery/:id`
   - Required params: `page`, `limit`, `search`
   - Methods available: `getGalleryAlbums(params)`, `getGalleryAlbum(id)`
   - Status: Stubbed, ready for connection

8. **GaleriVideo.vue** (Video Gallery)
   - API to connect: `GET /api/videos`
   - Required params: `category`, `platform`, `search`, `page`, `limit`
   - Methods available: `getVideos(params)`, `getVideoById(id)`, `getVideoCategories()`
   - Status: Stubbed, ready for connection

### 🔄 Profile Pages

9. **IdentitasSekolah.vue** (School Identity)
   - API to connect: `GET /api/school-profile`
   - Methods available: `getSchoolProfile()`, `getSchoolProfileByKey(key)`
   - Status: Currently using static data
   - Fields to fetch: school_name, npsn, address, phone, email, vision, mission

10. **Sejarah.vue** (History)
    - API to connect: `GET /api/school-profile/:key` (history_content)
    - Methods available: `getSchoolProfileByKey('history')`
    - Status: Currently using static timeline data

11. **Akreditasi.vue** (Accreditation)
    - API to connect: `GET /api/school-profile/:key`
    - Methods available: `getSchoolProfileByKey('accreditation_grade')`, `getSchoolProfileByKey('accreditation_year')`
    - Status: Currently using static data

12. **SaranaPrasarana.vue** (Facilities)
    - API to connect: `GET /api/facilities`
    - Required params: `category`, `condition`, `page`, `limit`
    - Methods available: `getFacilities(params)`, `getFacilityById(id)`, `getFacilityCategories()`, `getFacilityConditions()`
    - Status: Currently using static data

### 🔄 Homepage Components

13. **Home.vue** (Homepage)
    - Components needing API:
      - **News.vue**: Connect to `GET /api/news` (latest 5 news)
      - **PrincipalMessage.vue**: Connect to `GET /api/school-profile/:key` (principal_message, principal_name, principal_photo)
      - **Stats.vue**: Connect to `GET /api/school-profile/:key` (student_count, teacher_count, staff_count, achievement_count)
      - **VideoProfile.vue**: Connect to `GET /api/videos` (filter by category: 'profile')
    - Status: All using static data

## API Methods Available (Not Yet Used)

- `getAchievements(params)` - For achievements page (not in current routes)
- `getAchievementById(id)`
- `getAchievementCategories()`
- `getAchievementLevels()`
- `getAcademicYears()` - Needed for PesertaDidik filters
- `getActiveAcademicYear()`
- `getStudentById(id)` - For detail modal
- `getStudentEnrollmentHistory(id)`
- `getAlumniById(id)` - For detail modal
- `getAlumniStatuses()`

## Backend Requirements

The backend must implement these public endpoints (refer to API_DOCUMENTATION.md):
- ✅ `/api/news` (GET with pagination, search, status filter)
- ✅ `/api/news/slug/:slug` (GET by slug)
- ✅ `/api/contact` (POST form submission)
- ✅ `/api/school-profile` (GET all)
- ✅ `/api/school-profile/:key` (GET by key)
- ⏳ `/api/students` (GET with filters)
- ⏳ `/api/teachers` (GET with filters)
- ⏳ `/api/alumni` (GET and POST for public registration)
- ⏳ `/api/gallery` (GET albums and photos)
- ⏳ `/api/videos` (GET with filters)
- ⏳ `/api/facilities` (GET with filters)
- ⏳ `/api/achievements` (GET with filters)
- ⏳ `/api/academic-years` (GET all and active)

## Next Steps

1. **Backend Development** (4-day sprint - separate conversation)
   - Set up Express.js project with MySQL
   - Implement database schema (13 tables)
   - Develop JWT authentication
   - Create all public API endpoints
   - Test with frontend integration

2. **Continue Frontend API Integration**
   - Connect PesertaDidik.vue (students)
   - Connect GuruTendik.vue (teachers)
   - Connect PDNonAktif.vue (alumni with photo upload)
   - Connect GaleriFoto.vue (photo gallery)
   - Connect GaleriVideo.vue (video gallery)
   - Connect SaranaPrasarana.vue (facilities)
   - Update Home.vue components with dynamic data
   - Update profile pages with dynamic content

3. **Testing & Refinement**
   - Test all API integrations
   - Handle edge cases and errors
   - Add loading states everywhere
   - Implement image fallbacks
   - Test responsive design
   - Performance optimization

4. **Admin Panel** (After public APIs working)
   - Build admin UI pages
   - Implement authentication flow
   - CRUD operations for all modules
   - File upload interfaces
   - User management

## Installation & Setup

```bash
# Install dependencies (already done)
npm install axios

# Create .env file (copy from .env.example)
cp .env.example .env

# Update VITE_API_BASE_URL to your backend URL
# VITE_API_BASE_URL=http://localhost:3000/api
```

## Usage Example

```javascript
// In any Vue component
import { getNews, submitContact } from '@/services/api'

// Fetch news
const fetchNews = async () => {
  try {
    const response = await getNews({ page: 1, limit: 10, status: 'published' })
    if (response.success) {
      news.value = response.data
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Submit contact form
const submitForm = async () => {
  try {
    const response = await submitContact({ name, email, subject, message })
    if (response.success) {
      alert('Success!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## Notes

- All API methods return consistent response format: `{ success, data, message }`
- Pagination responses include `pagination` object with `page`, `limit`, `total`, `totalPages`
- File uploads use `multipart/form-data` encoding
- Authentication uses JWT tokens stored in localStorage
- CORS must be configured on backend to allow frontend origin
- Error responses should be handled gracefully with user-friendly messages
