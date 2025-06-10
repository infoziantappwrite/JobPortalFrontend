import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import signUp from '../assets/SignUpPage.png';
import apiClient from '../api/apiClient';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resendLinkVisible, setResendLinkVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/login', { email, password },{
          withCredentials: true,
        });
      const {token,user } = response.data;
      if (user.role === 'user' && !user.emailVerified){
        toast.error('Please verify your email before logging in.');
        setResendLinkVisible(true);
        return;
      }
      

      if (user.role === 'admin' && user.status !== 'approved') {
        toast.warn('Your account is pending approval by the Super Admin.');
        return;
      }
      Cookies.set('at', token, { expires: 1 }); 
      
      
      toast.success('Login successful');
      await refreshUser();      
     

      setTimeout(() => {
      navigate('/');
    }, 1000);
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 403 && data?.emailVerificationLink) {
        setResendLinkVisible(true);
      }

      toast.error(data?.error || 'Login failed');
    }
  };

  const handleResendVerification = async () => {
    try {
      await apiClient.post('/resend-verification', { email });
      toast.success('Verification email resent!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend email');
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
        <div className="w-full h-full overflow-y-auto px-6 py-10 flex flex-col items-center justify-start">
          <h2 className="text-2xl font-jost text-gray-800 text-center mb-8">
            Login to Infoziant
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {isPasswordVisible ? (
                  <FiEyeOff size={16} className="text-gray-600" />
                ) : (
                  <FiEye size={16} className="text-gray-600" />
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-indigo-600" />
                Remember me
              </label>
              <a href="#" className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300"
            >
              Log In
            </button>
          </form>

          {resendLinkVisible && (
            <div className="text-sm text-center text-gray-600 mt-4 space-y-2">
              <p className="text-red-500 font-jost">
                Your email is not verified. Please verify to proceed.
              </p>
              
              <button
                onClick={handleResendVerification}
                className="text-indigo-600 font-jost underline hover:text-indigo-800"
              >
                Resend Verification Email
              </button>
            </div>
          )}

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-indigo-600 font-jost hover:underline cursor-pointer"
            >
              Register here
            </span>
          </p>

          <div className="flex items-center my-6 w-full max-w-sm">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-500 font-jost">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Social Buttons - Scrollable */}
          <div className="space-y-3 ">
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition font-jost"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
                className="mr-2"
              />
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition font-jost"
            >
              <img
                src="https://img.icons8.com/color/16/000000/microsoft.png"
                alt="Microsoft"
                className="mr-2"
              />
              Continue with Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
