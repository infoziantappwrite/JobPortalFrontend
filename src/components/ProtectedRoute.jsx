import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchCurrentUser } from '../api/fetchuser'; // the function you created
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, roles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Authentication failed. Please login again.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return null; // or a loading spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    toast.warn('Unauthorized access. Redirected to home.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
