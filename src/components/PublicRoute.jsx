import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const PublicRoute = ({ children }) => {
  const token = Cookies.get('at');

  useEffect(() => {
    if (token) {
      toast.warn('You are already logged in!');
    }
  }, [token]);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
