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

// ==================== PHOTO GALLERIES MANAGEMENT ====================

/**
 * Get album by ID
 * @param {number} id - Album ID
 */
export const getAdminAlbumById = async (id) => {
  return adminApi.get(`/admin/gallery/albums/${id}`);
};

/**
 * Create new photo album
 * @param {FormData} formData - Form data including title, description, and optional cover_image
 */
export const createAlbum = async (formData) => {
  return adminApi.post("/admin/gallery/albums", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update photo album
 * @param {number} id - Album ID
 * @param {FormData} formData - Form data including title, description, and optional cover_image
 */
export const updateAlbum = async (id, formData) => {
  return adminApi.put(`/admin/gallery/albums/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete photo album and all its photos
 * @param {number} id - Album ID
 */
export const deleteAlbum = async (id) => {
  return adminApi.delete(`/admin/gallery/albums/${id}`);
};

/**
 * Add photo to album
 * @param {number} albumId - Album ID
 * @param {FormData} formData - Form data including caption and photo file
 */
export const addPhotoToAlbum = async (albumId, formData) => {
  return adminApi.post(`/admin/gallery/albums/${albumId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update photo
 * @param {number} id - Photo ID
 * @param {FormData} formData - Form data including caption and optional photo file
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
 * @param {Object} data - { photo_ids: [1, 2, 3, ...] }
 */
export const reorderPhotos = async (albumId, data) => {
  return adminApi.put(`/admin/gallery/albums/${albumId}/photos/reorder`, data);
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

export default adminApi;
