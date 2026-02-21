import { ref } from "vue";
import api from "./api";

// Cached school profile data with defaults
const schoolProfile = ref({
  school_name: "SDIT Rohmatul Ummah",
  npsn: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  principal_name: "",
  principal_message: "",
  established_year: "",
  accreditation: "",
  accreditation_year: "",
  logo_url: "",
  vision: "",
  mission: "",
  map_embed_url: "",
});

const isLoaded = ref(false);
const isLoading = ref(false);

/**
 * Load all school profile data from API and cache it
 */
export const loadSchoolProfile = async () => {
  if (isLoaded.value || isLoading.value) {
    return schoolProfile.value;
  }

  isLoading.value = true;

  try {
    // Fetch all profile data at once
    const response = await api.get("/school-profile");

    if (response.success) {
      // Check if data is an array (old format) or object (new format)
      if (Array.isArray(response.data)) {
        // Array format: [{key: 'school_name', value: 'SDIT...'}, ...]
        response.data.forEach((item) => {
          if (item.key && item.value) {
            schoolProfile.value[item.key] = item.value;
          }
        });
      } else if (typeof response.data === 'object' && response.data !== null) {
        // Object format: {school_name: 'SDIT...', npsn: '...', ...}
        Object.keys(response.data).forEach((key) => {
          if (response.data[key] !== null && response.data[key] !== undefined) {
            schoolProfile.value[key] = response.data[key];
          }
        });
      }

      isLoaded.value = true;
      console.log("School profile loaded:", schoolProfile.value);
    } else {
      console.error("API returned success: false", response);
  }

  return schoolProfile.value;
  }
  catch (error) {
    console.error("Error loading school profile:", error);
    throw error;
  }
  finally {
    isLoading.value = false;
  }
}

/**
 * Get cached school profile data (load if not already loaded)
 */
export const useSchoolProfile = () => {
  if (!isLoaded.value && !isLoading.value) {
    loadSchoolProfile();
  }

  return {
    schoolProfile,
    isLoaded,
    isLoading,
    loadSchoolProfile,
  };
};

export default useSchoolProfile;
