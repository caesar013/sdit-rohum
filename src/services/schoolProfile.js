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

    if (response.data.success && Array.isArray(response.data.data)) {
      // Iterate through all keys and populate the profile
      response.data.data.forEach((item) => {
        if (item.key && item.value) {
          schoolProfile.value[item.key] = item.value;
        }
      });

      isLoaded.value = true;
      console.log("School profile loaded:", schoolProfile.value);
    }
  } catch (error) {
    console.error("Error loading school profile:", error);
  } finally {
    isLoading.value = false;
  }

  return schoolProfile.value;
};

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
