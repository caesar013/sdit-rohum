import axios from "axios";

// Create axios instance with base URL
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/admin/login";
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

// ==================== NEWS MANAGEMENT ====================

/**
 * Get all news articles (admin view - includes drafts)
 * @param {Object} params - Query parameters (page, limit, search, category, status)
 */
export const getAdminNews = async (params = {}) => {
  return adminApi.get("/admin/news", { params });
};

/**
 * Get single news article by ID
 * @param {number} id - News article ID
 */
export const getAdminNewsById = async (id) => {
  return adminApi.get(`/admin/news/${id}`);
};

/**
 * Create new news article
 * @param {FormData} formData - Form data including title, content, category, status, and optional featured_image
 */
export const createNews = async (formData) => {
  return adminApi.post("/admin/news", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update existing news article
 * @param {number} id - News article ID
 * @param {FormData} formData - Form data including title, content, category, status, and optional featured_image
 */
export const updateNews = async (id, formData) => {
  return adminApi.put(`/admin/news/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete news article
 * @param {number} id - News article ID
 */
export const deleteNews = async (id) => {
  return adminApi.delete(`/admin/news/${id}`);
};

// ==================== SCHOOL PROFILE MANAGEMENT ====================

/**
 * Create new school profile key-value
 * @param {Object} data - { key, value }
 */
export const createSchoolProfile = async (data) => {
  return adminApi.post("/admin/school-profile", data);
};

/**
 * Update school profile value by key
 * @param {string} key - Profile key
 * @param {Object} data - { value }
 */
export const updateSchoolProfile = async (key, data) => {
  return adminApi.put(`/admin/school-profile/${key}`, data);
};

/**
 * Update multiple school profile key-value pairs at once
 * @param {Object} data - Object with key-value pairs to update
 */
export const updateSchoolProfileBulk = async (data) => {
  return adminApi.put("/admin/school-profile", data);
};

/**
 * Delete school profile key-value
 * @param {string} key - Profile key
 */
export const deleteSchoolProfile = async (key) => {
  return adminApi.delete(`/admin/school-profile/${key}`);
};

// ==================== COMMENTS MANAGEMENT ====================

/**
 * Get all comments with filters
 * @param {Object} params - Query parameters (page, limit, status, news_id)
 */
export const getAdminComments = async (params = {}) => {
  return adminApi.get("/admin/comments", { params });
};

/**
 * Get single comment by ID
 * @param {number} id - Comment ID
 */
export const getAdminCommentById = async (id) => {
  return adminApi.get(`/admin/comments/${id}`);
};

/**
 * Update comment status
 * @param {number} id - Comment ID
 * @param {Object} data - { status: 'pending' | 'approved' | 'rejected' }
 */
export const updateCommentStatus = async (id, data) => {
  return adminApi.put(`/admin/comments/${id}/status`, data);
};

/**
 * Delete comment
 * @param {number} id - Comment ID
 */
export const deleteComment = async (id) => {
  return adminApi.delete(`/admin/comments/${id}`);
};

/**
 * Get comment status counts for a news article
 * @param {number} newsId - News article ID
 */
export const getCommentStats = async (newsId) => {
  return adminApi.get(`/admin/comments/news/${newsId}/stats`);
};

// ==================== VIDEOS MANAGEMENT ====================

/**
 * Create new video
 * @param {Object} data - { title, description, video_url, platform, category }
 */
export const createVideo = async (data) => {
  return adminApi.post("/admin/videos", data);
};

/**
 * Update video
 * @param {number} id - Video ID
 * @param {Object} data - { title, description, video_url, platform, category }
 */
export const updateVideo = async (id, data) => {
  return adminApi.put(`/admin/videos/${id}`, data);
};

/**
 * Delete video
 * @param {number} id - Video ID
 */
export const deleteVideo = async (id) => {
  return adminApi.delete(`/admin/videos/${id}`);
};

// ==================== CONTACT MESSAGES MANAGEMENT ====================

/**
 * Get all contact messages
 * @param {Object} params - Query parameters (page, limit, status)
 */
export const getAdminContacts = async (params = {}) => {
  return adminApi.get("/admin/contact", { params });
};

/**
 * Get contact message stats
 */
export const getContactStats = async () => {
  return adminApi.get("/admin/contact/stats");
};

/**
 * Get single contact message by ID
 * @param {number} id - Contact message ID
 */
export const getAdminContactById = async (id) => {
  return adminApi.get(`/admin/contact/${id}`);
};

/**
 * Update contact message status
 * @param {number} id - Contact message ID
 * @param {Object} data - { status: 'new' | 'read' | 'replied' }
 */
export const updateContactStatus = async (id, data) => {
  return adminApi.put(`/admin/contact/${id}/status`, data);
};

/**
 * Delete contact message
 * @param {number} id - Contact message ID
 */
export const deleteContact = async (id) => {
  return adminApi.delete(`/admin/contact/${id}`);
};

// ==================== TEACHERS MANAGEMENT ====================

/**
 * Get teacher status counts
 */
export const getTeacherStats = async () => {
  return adminApi.get("/admin/teachers/stats");
};

/**
 * Create new teacher
 * @param {FormData} formData - Form data including name, nip, subject, status, and optional photo
 */
export const createTeacher = async (formData) => {
  return adminApi.post("/admin/teachers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update teacher
 * @param {number} id - Teacher ID
 * @param {FormData} formData - Form data including name, nip, subject, status, and optional photo
 */
export const updateTeacher = async (id, formData) => {
  return adminApi.put(`/admin/teachers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete teacher
 * @param {number} id - Teacher ID
 */
export const deleteTeacher = async (id) => {
  return adminApi.delete(`/admin/teachers/${id}`);
};

// ==================== STUDENTS MANAGEMENT ====================

/**
 * Get all students (admin view)
 * @param {Object} params - Query parameters (page, limit, academic_year, grade, status, gender)
 */
export const getAdminStudents = async (params = {}) => {
  return adminApi.get("/students", { params });
};

/**
 * Create new student
 * @param {FormData} formData - Form data including nisn, name, gender, birth_date, address, parent_name, parent_phone, status, and optional photo
 */
export const createStudent = async (formData) => {
  return adminApi.post("/admin/students", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update student
 * @param {number} id - Student ID
 * @param {FormData} formData - Form data including nisn, name, gender, birth_date, address, parent_name, parent_phone, status, and optional photo
 */
export const updateStudent = async (id, formData) => {
  return adminApi.put(`/admin/students/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete student
 * @param {number} id - Student ID
 */
export const deleteStudent = async (id) => {
  return adminApi.delete(`/admin/students/${id}`);
};

/**
 * Enroll student in class
 * @param {number} id - Student ID
 * @param {Object} data - { class_id: number }
 */
export const enrollStudent = async (id, data) => {
  return adminApi.post(`/admin/students/${id}/enroll`, data);
};

/**
 * Unenroll student from class
 * @param {number} studentId - Student ID
 * @param {number} classId - Class ID
 */
export const unenrollStudent = async (studentId, classId) => {
  return adminApi.delete(`/admin/students/${studentId}/enroll/${classId}`);
};

// ==================== ALUMNI MANAGEMENT ====================

/**
 * Get alumni status counts
 */
export const getAlumniStatusCounts = async () => {
  return adminApi.get("/admin/alumni/status-counts");
};

/**
 * Update alumni
 * @param {number} id - Alumni ID
 * @param {FormData} formData - Form data including name, nisn, gender, graduation_year, etc., and optional photo
 */
export const updateAlumni = async (id, formData) => {
  return adminApi.put(`/admin/alumni/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update alumni registration status
 * @param {number} id - Alumni ID
 * @param {Object} data - { registration_status: 'pending' | 'approved' | 'rejected' }
 */
export const updateAlumniStatus = async (id, data) => {
  return adminApi.put(`/admin/alumni/${id}/status`, data);
};

/**
 * Delete alumni
 * @param {number} id - Alumni ID
 */
export const deleteAlumni = async (id) => {
  return adminApi.delete(`/admin/alumni/${id}`);
};

// ==================== FACILITIES MANAGEMENT ====================

/**
 * Get facility counts by category
 */
export const getFacilityCategoryStats = async () => {
  return adminApi.get("/admin/facilities/category-stats");
};

/**
 * Get facility counts by condition
 */
export const getFacilityConditionStats = async () => {
  return adminApi.get("/admin/facilities/condition-stats");
};

/**
 * Create new facility
 * @param {FormData} formData - Form data including name, category, quantity, condition, description, and optional photo
 */
export const createFacility = async (formData) => {
  return adminApi.post("/admin/facilities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update facility
 * @param {number} id - Facility ID
 * @param {FormData} formData - Form data including name, category, quantity, condition, description, and optional photo
 */
export const updateFacility = async (id, formData) => {
  return adminApi.put(`/admin/facilities/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete facility
 * @param {number} id - Facility ID
 */
export const deleteFacility = async (id) => {
  return adminApi.delete(`/admin/facilities/${id}`);
};

// ==================== ACHIEVEMENTS MANAGEMENT ====================

/**
 * Get achievement counts by category
 */
export const getAchievementCategoryStats = async () => {
  return adminApi.get("/admin/achievements/category-stats");
};

/**
 * Get achievement counts by level
 */
export const getAchievementLevelStats = async () => {
  return adminApi.get("/admin/achievements/level-stats");
};

/**
 * Create new achievement
 * @param {FormData} formData - Form data including title, description, category, level, achievement_date, year, and optional certificate_image
 */
export const createAchievement = async (formData) => {
  return adminApi.post("/admin/achievements", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update achievement
 * @param {number} id - Achievement ID
 * @param {FormData} formData - Form data including title, description, category, level, achievement_date, year, and optional certificate_image
 */
export const updateAchievement = async (id, formData) => {
  return adminApi.put(`/admin/achievements/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete achievement
 * @param {number} id - Achievement ID
 */
export const deleteAchievement = async (id) => {
  return adminApi.delete(`/admin/achievements/${id}`);
};

// ==================== PHOTO GALLERIES MANAGEMENT ====================

/**
 * Get album by ID
 * @param {number} id - Album ID
 */
export const getAlbumById = async (id) => {
  return adminApi.get(`/admin/gallery/albums/${id}`);
};

/**
 * Create new photo album
 * @param {FormData} formData - Form data including title, description, album_date, and optional cover_photo
 */
export const createAlbum = async (formData) => {
  return adminApi.post("/admin/gallery/albums", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update photo album
 * @param {number} id - Album ID
 * @param {FormData} formData - Form data including title, description, album_date, and optional cover_photo
 */
export const updateAlbum = async (id, formData) => {
  return adminApi.put(`/admin/gallery/albums/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete photo album and all photos
 * @param {number} id - Album ID
 */
export const deleteAlbum = async (id) => {
  return adminApi.delete(`/admin/gallery/albums/${id}`);
};

/**
 * Add photo to album
 * @param {number} albumId - Album ID
 * @param {FormData} formData - Form data including photo, caption, display_order
 */
export const addPhotoToAlbum = async (albumId, formData) => {
  return adminApi.post(`/admin/gallery/albums/${albumId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update photo
 * @param {number} id - Photo ID
 * @param {FormData} formData - Form data including optional photo, caption, display_order
 */
export const updatePhoto = async (id, formData) => {
  return adminApi.put(`/admin/gallery/photos/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete photo from album
 * @param {number} id - Photo ID
 */
export const deletePhoto = async (id) => {
  return adminApi.delete(`/admin/gallery/photos/${id}`);
};

/**
 * Reorder photos in album
 * @param {number} albumId - Album ID
 * @param {Object} data - { photos: Array<{id, display_order}> }
 */
export const reorderPhotos = async (albumId, data) => {
  return adminApi.put(`/admin/gallery/albums/${albumId}/photos/reorder`, data);
};

export default adminApi;
