// import your existing apiClient
import apiClient from './apiClient';

// function to fetch current user using apiClient
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('common/auth/me');
    //console.log('Current user fetched successfully:', response.data);
    return response.data.user; // user data
   
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
