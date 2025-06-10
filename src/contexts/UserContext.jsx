/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { fetchCurrentUser } from '../api/fetchuser';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      //console.error('Error refreshing user:', error);
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser(); // initial fetch
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
