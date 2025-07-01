import { useState } from 'react';
import { toast } from 'react-toastify';
import signUp from '../../assets/SignUpPage.png';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/candidate/auth/forgot-password', { email });
      toast.success(response.data.message || 'Reset password link sent! Check your email.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 h-full">
        <img src={signUp} alt="forgot password visual" className="w-full h-full object-cover" />
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-10 bg-white rounded-lg flex flex-col justify-center">
          <h2 className="text-2xl text-center mb-6 font-semibold text-gray-800">
            Forgot your password?
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Remember your password?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
