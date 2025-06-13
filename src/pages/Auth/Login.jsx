import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import signUp from '../../assets/SignUpPage.png';
import apiClient from '../../api/apiClient';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { useUser } from '../../contexts/UserContext';

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(`/${role}/auth/login`, { email, password }, {
        withCredentials: true,
      });
      // Store the token in cookies
      Cookies.set('at', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
      //console.log('Login response:', response.data);
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
        <div className="w-full h-full overflow-y-auto px-6 py-10 flex flex-col items-center justify-start">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            Login to Infoziant
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
            {/* Role Selector */}
            <div className="w-full border border-gray-300 rounded-lg ">
              
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="" disabled>
                  -- Select Role --
                </option>
                <option value="candidate">Candidate</option>
                <option value="company">Company</option>
                <option value="employee">Employee</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>


            {/* Email Field */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            {/* Password Field */}
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {isPasswordVisible ? (
                  <FiEyeOff size={18} className="text-gray-600" />
                ) : (
                  <FiEye size={18} className="text-gray-600" />
                )}
              </span>
            </div>

            {/* Remember me and Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-teal-600" />
                Remember me
              </label>
              <a href="#" className="text-teal-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300"
            >
              Log In
            </button>
          </form>

          {/* Resend Link */}


          {/* Register Redirect */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
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

export default Login;
