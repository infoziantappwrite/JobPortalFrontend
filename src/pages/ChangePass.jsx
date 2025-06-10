/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import {
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword === oldPassword) {
      toast.error('New password cannot be the same as old password');
    
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    

    try {
      await apiClient.post('/reset-password', {
        oldPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    }
  };

  const renderPasswordField = (label, value, setValue, show, setShow) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-700 font-medium">{label}</label>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-gray-500 hover:text-indigo-600"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full input p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-start justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl mt-5 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🔐 Change Password
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <FiXCircle />
            {error}
          </div>
        )}

        {renderPasswordField('Old Password', oldPassword, setOldPassword, showOld, setShowOld)}
        {renderPasswordField('New Password', newPassword, setNewPassword, showNew, setShowNew)}
        {renderPasswordField('Confirm New Password', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm)}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:from-teal-600 hover:to-indigo-700 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePass;
