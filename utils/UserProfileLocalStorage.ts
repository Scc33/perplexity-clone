import { UserProfile } from "../types";
import { saveToLocalStorage, loadFromLocalStorage } from "./LocalStorageUtils";

// Storage key
const USER_PROFILE_KEY = "perplexity_clone_user_profile";

// Default user profile
const DEFAULT_USER_PROFILE: UserProfile = {
  name: "User",
  email: "user@example.com",
};

// User Profile storage functions
export const saveUserProfile = (profile: UserProfile): void => {
  saveToLocalStorage(USER_PROFILE_KEY, profile);
};

export const loadUserProfile = (): UserProfile => {
  return loadFromLocalStorage<UserProfile>(
    USER_PROFILE_KEY,
    DEFAULT_USER_PROFILE
  );
};
