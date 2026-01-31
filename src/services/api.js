import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Optionally redirect to login page
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

// ==================== SCHOOL PROFILE ====================
export const getSchoolProfile = async () => {
  return api.get("/school-profile");
};

export const getSchoolProfileByKey = async (key) => {
  return api.get(`/school-profile/${key}`);
};

// ==================== NEWS ====================
export const getNews = async (params = {}) => {
  return api.get("/news", { params });
};

export const getNewsBySlug = async (slug) => {
  return api.get(`/news/slug/${slug}`);
};

export const getNewsById = async (id) => {
  return api.get(`/news/${id}`);
};

export const getNewsCategories = async () => {
  return api.get("/news/categories");
};

// ==================== NEWS COMMENTS ====================
export const getNewsComments = async (newsId, params = {}) => {
  return api.get(`/news/${newsId}/comments`, { params });
};

export const submitNewsComment = async (newsId, data) => {
  return api.post(`/news/${newsId}/comments`, data);
};

// ==================== VIDEOS ====================
export const getVideos = async (params = {}) => {
  return api.get("/videos", { params });
};

export const getVideoById = async (id) => {
  return api.get(`/videos/${id}`);
};

export const getVideoCategories = async () => {
  return api.get("/videos/categories");
};

// ==================== PHOTO GALLERIES ====================
export const getGalleryAlbums = async (params = {}) => {
  return api.get("/gallery/albums", { params });
};

export const getGalleryAlbum = async (slug) => {
  return api.get(`/gallery/albums/slug/${slug}`);
};

// ==================== CONTACT ====================
export const submitContact = async (data) => {
  return api.post("/contact", data);
};

// ==================== TEACHERS ====================
export const getTeachers = async (params = {}) => {
  return api.get("/teachers", { params });
};

export const getTeacherById = async (id) => {
  return api.get(`/teachers/${id}`);
};

export const getTeacherStatuses = async () => {
  return api.get("/teachers/statuses");
};

// ==================== FACILITIES ====================
export const getFacilities = async (params = {}) => {
  return api.get("/facilities", { params });
};

export const getFacilityById = async (id) => {
  return api.get(`/facilities/${id}`);
};

export const getFacilityCategories = async () => {
  return api.get("/facilities/categories");
};

export const getFacilityConditions = async () => {
  return api.get("/facilities/conditions");
};

// ==================== ACHIEVEMENTS ====================
export const getAchievements = async (params = {}) => {
  return api.get("/achievements", { params });
};

export const getAchievementById = async (id) => {
  return api.get(`/achievements/${id}`);
};

export const getAchievementCategories = async () => {
  return api.get("/achievements/categories");
};

export const getAchievementLevels = async () => {
  return api.get("/achievements/levels");
};

// ==================== ACADEMIC YEARS ====================
export const getAcademicYears = async () => {
  return api.get("/academic-years");
};

export const getActiveAcademicYear = async () => {
  return api.get("/academic-years/active");
};

export const getAcademicYearById = async (id) => {
  return api.get(`/academic-years/${id}`);
};

// ==================== STUDENTS ====================
export const getStudents = async (params = {}) => {
  return api.get("/students", { params });
};

export const getStudentById = async (id) => {
  return api.get(`/students/${id}`);
};

export const getStudentEnrollmentHistory = async (id) => {
  return api.get(`/students/${id}/enrollment-history`);
};

export const getStudentStatuses = async () => {
  return api.get("/students/statuses");
};

// ==================== ALUMNI ====================
export const getAlumni = async (params = {}) => {
  return api.get("/alumni", { params });
};

export const getAlumniById = async (id) => {
  return api.get(`/alumni/${id}`);
};

export const getAlumniGraduationYears = async () => {
  return api.get("/alumni/graduation-years");
};

export const getAlumniStatuses = async () => {
  return api.get("/alumni/statuses");
};

export const registerAlumni = async (formData) => {
  return api.post("/alumni", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default api;
