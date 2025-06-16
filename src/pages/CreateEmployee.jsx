import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await apiClient.post('/company/employee/create/employee', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee created successfully');
      setFormData({ name: '', email: '', password: '', position: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
