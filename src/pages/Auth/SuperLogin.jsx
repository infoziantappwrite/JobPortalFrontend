import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import signUp from '../../assets/SignUpPage.png';
import apiClient from '../../api/apiClient';
import Cookies from 'js-cookie';
import { useUser } from '../../contexts/UserContext';
import { Eye, EyeOff } from 'lucide-react'; // Lucide icons

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const role = 'SuperAdmin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(`/${role}/auth/login`, { email, password }, {
        withCredentials: true,
      });

      Cookies.set('at', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });

      toast.success(response.data.message || 'Login successful');
      await refreshUser();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      const data = error.response?.data;
      toast.error(data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 h-full">
        <img
          src={signUp}
          alt="login visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-10 bg-white rounded-lg flex flex-col justify-center">
          <h2 className="text-2xl text-center mb-6 font-semibold text-gray-800">
            👋 Welcome back, SuperAdmin!
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-teal-600" />
                Remember me
              </label>
              <a href="#" className="text-teal-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register/SuperAdmin')}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
