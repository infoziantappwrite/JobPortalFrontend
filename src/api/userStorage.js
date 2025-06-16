// utils/userStorage.js

const USER_KEY = 'infoziant_user';

/**
 * Save user data to localStorage
 * @param {Object} user - The user object to store
 */
export const setUserToLocal = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - Parsed user object or null if not found
 */
export const getUserFromLocal = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const clearUserFromLocal = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};
