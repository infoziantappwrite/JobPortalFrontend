import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';

const PublicRoute = ({ children }) => {
  const { user } = useUser();
  const toastShown = useRef(false); // <-- NEW

  useEffect(() => {
    if (user && !toastShown.current) {
      toast.warn('You are already logged in!');
      toastShown.current = true;
    }
  }, [user]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
