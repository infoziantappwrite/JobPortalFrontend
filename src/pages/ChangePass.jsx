import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import apiClient from '../api/apiClient';

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match");
      return;
    }

    setLoading(true);

    try {
      // Assuming `apiClient` and the API call are correctly set up
      const response = await apiClient.post('/reset-password', {
        oldPassword,
        newPassword,
      });

      setSuccess(response.data.message || 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-50 flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Change Password</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Update your account password ✨
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-center font-semibold">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center font-semibold">{success}</p>
        )}

        {/* Password Fields */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Password Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <label className="flex flex-col">
              Old Password
              <div className="relative">
                <input
                  type={isOldPasswordVisible ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="input bg-indigo-50"
                  autoComplete="current-password"
                />
                <span
                  onClick={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {isOldPasswordVisible ? <FiEyeOff size={16} className="text-gray-600" /> : <FiEye size={16} className="text-gray-600" />}
                </span>
              </div>
            </label>

            <label className="flex flex-col">
              New Password
              <div className="relative">
                <input
                  type={isNewPasswordVisible ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input bg-indigo-50"
                  autoComplete="new-password"
                />
                <span
                  onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {isNewPasswordVisible ? <FiEyeOff size={16}  className="text-gray-600"/> : <FiEye size={16} className="text-gray-600"/>}
                </span>
              </div>
            </label>

            <label className="flex flex-col">
              Confirm New Password
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input bg-indigo-50"
                  autoComplete="new-password"
                />
                <span
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {isConfirmPasswordVisible ? <FiEyeOff size={16} className="text-gray-600" /> : <FiEye size={16} className="text-gray-600" />}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-3 rounded-full w-full transition-colors duration-300"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePass;
