// Generic localStorage utility functions

// Helper to check if localStorage is available
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Generic save function
export const saveToLocalStorage = (key: string, data: unknown): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save data to localStorage (${key}):`, error);
  }
};

// Generic load function
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return defaultValue;
  }

  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load data from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Generic remove function
export const removeFromLocalStorage = (key: string): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove data from localStorage (${key}):`, error);
  }
};

// Helper function to get relative time ago
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};

// Test function to verify localStorage functionality
export const testLocalStorage = (): boolean => {
  try {
    const testKey = "__test_storage__";
    const testData = { test: "data" };

    // Test saving and loading
    saveToLocalStorage(testKey, testData);
    const loadedData = loadFromLocalStorage<{ test: string } | null>(
      testKey,
      null
    );

    // Clean up
    removeFromLocalStorage(testKey);

    return loadedData !== null && loadedData.test === "data";
  } catch (error) {
    console.error("LocalStorage test failed:", error);
    return false;
  }
};
