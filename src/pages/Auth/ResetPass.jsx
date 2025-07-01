import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPassVisible, setIsNewPassVisible] = useState(false);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post(
        `/candidate/auth/reset-password/${token}`,
        { newPassword }
      );

      toast.success(response.data.message || 'Password reset successfully!');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to reset password';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Title outside the form */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
          <FiLock className="text-teal-600" size={32} />
          Welcome to Infoziant!
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
      >
        <p className="text-center mb-8 text-gray-600 text-lg">
          Type your new password to reset your account
        </p>

        {/* New Password */}
        <label htmlFor="newPassword" className="block mb-2 font-medium">
          New Password
        </label>
        <div className="relative mb-6">
          <input
            id="newPassword"
            type={isNewPassVisible ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span
            onClick={() => setIsNewPassVisible(!isNewPassVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {isNewPassVisible ? (
              <FiEyeOff size={18} className="text-gray-600" />
            ) : (
              <FiEye size={18} className="text-gray-600" />
            )}
          </span>
        </div>

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="block mb-2 font-medium">
          Confirm Password
        </label>
        <div className="relative mb-6">
          <input
            id="confirmPassword"
            type={isConfirmPassVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span
            onClick={() => setIsConfirmPassVisible(!isConfirmPassVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {isConfirmPassVisible ? (
              <FiEyeOff size={18} className="text-gray-600" />
            ) : (
              <FiEye size={18} className="text-gray-600" />
            )}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
