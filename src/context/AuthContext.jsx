import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient'; // make sure this is configured properly

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use effect to check if the user is already authenticated on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Make an authenticated request to the backend to get the current user's details
        const res = await apiClient.get('/me', { withCredentials: true });
        const userData = res.data.user || res.data; // fallback to data structure
        setUser(userData);
      } catch (error) {
        console.error('Session check failed:', error);
        setUser(null); // If there's any error (e.g., token expired), reset user state
      } finally {
        setLoading(false); // Stop loading after checking session
      }
    };

    checkSession();
  }, []);

  // Login function to authenticate user and save the user data
  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/login', { email, password }, { withCredentials: true });
      const userData = res.data.user || res.data;
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
    }
  };

  // Logout function to clear the user state and handle the logout backend call
  const logout = async () => {
    try {
      await apiClient.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null); // Clear the user from state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
