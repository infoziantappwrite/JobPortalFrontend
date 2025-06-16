import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import register from '../../assets/Register.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    //console.log('Registering with role:', role);
    e.preventDefault();
    try {
      await apiClient.post(`${role}/auth/register`, {
        name,
        email,
        password,
      });
      toast.success('Registration successful. Please verify your email.');

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side Visual */}
      <div className="hidden md:flex w-1/2 h-lvh">
        <img
          src={register}
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center">
        <div className="w-full h-full overflow-y-auto px-6 py-10 flex flex-col items-center justify-start">
          <h2 className="text-2xl font-jost mb-10 text-gray-800 text-center">
            🙌 Hey there! Create your account
          </h2>

          {/* Role toggle buttons */}
          <div className="flex flex-col gap-6 mb-6 md:flex-row">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`text-lg px-12 py-3 rounded-lg font-jost transition ${role === 'candidate'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-800 text-white shadow-lg'
                : 'bg-teal-100 text-teal-900'
                }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('company')}
              className={`text-lg px-12 py-3 rounded-lg font-jost transition ${role === 'company'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-800 text-white shadow-lg'
                : 'bg-teal-100 text-teal-900'
                }`}
            >
              Organisation
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {isPasswordVisible ? (
                  <FiEyeOff size={16} className="text-gray-600" />
                ) : (
                  <FiEye size={16} className="text-gray-600" />
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-lg bg-gradient-to-r from-teal-500 to-indigo-800 text-white font-jost rounded-lg hover:bg-indigo-800 transition duration-300"
            >
              Register
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-sm text-center text-gray-600 mt-6 font-jost">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>

          {/* OR Divider */}



        </div>
      </div>
    </div>
  );
};

export default Register;
