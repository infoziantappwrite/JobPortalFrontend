import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { FiX, FiUserPlus } from 'react-icons/fi';

export default function CreateEmployeeModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      await apiClient.post('/company/employee/create/', formData);
      toast.success('Employee created successfully');
      setFormData({ name: '', email: '', password: '', position: '' });
      onClose();
      onCreated(); // to refetch list or update UI
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
            <FiUserPlus />
          </div>
          <h2 className="text-lg font-bold text-indigo-700">Create New Employee</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'password', 'position'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder={
                  field === 'name'
                    ? 'John Doe'
                    : field === 'email'
                    ? 'john@example.com'
                    : field === 'password'
                    ? 'Enter password'
                    : 'Software Developer'
                }
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
}
