
import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const PROFILE_STORAGE_KEY = "actify_profile_v1";

const ProfileContext = createContext(null);

const defaultProfile = {
  personal: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    pinCode: "",
    country: "",
    state: "",
    city: "",
  },
  education: [],
  experience: [],
  other: {
    skills: [],
    languages: [],
    certifications: "",
    linkedin: "",
    portfolio: "",
    github: "",
    additionalInfo: "",
  },
};

function loadStoredProfile() {
  try {
    const saved = localStorage.getItem(
      PROFILE_STORAGE_KEY
    );

    if (!saved) return defaultProfile;

    const parsed = JSON.parse(saved);

    return {
      ...defaultProfile,
      ...parsed,
      personal: {
        ...defaultProfile.personal,
        ...(parsed.personal || {}),
      },
      education: Array.isArray(parsed.education)
        ? parsed.education
        : [],
      experience: Array.isArray(parsed.experience)
        ? parsed.experience
        : [],
      other: {
        ...defaultProfile.other,
        ...(parsed.other || {}),
        skills: Array.isArray(parsed.other?.skills)
          ? parsed.other.skills
          : [],
        languages: Array.isArray(parsed.other?.languages)
          ? parsed.other.languages
          : [],
      },
    };
  } catch (error) {
    console.error("Error loading profile:", error);
    return defaultProfile;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(
    loadStoredProfile
  );

  const saveProfile = useCallback((updatedProfile) => {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(updatedProfile)
    );

    setProfile(updatedProfile);
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, saveProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  }

  return context;
}
