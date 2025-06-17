import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const EditJob = () => {
  const { state: job } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    jobType: job.jobType || '',
    careerLevel: job.careerLevel || '',
    experience: job.experience || '',
    qualification: job.qualification || '',
    gender: job.gender || '',
    industry: job.industry || '',
    description: job.description || '',
    specialisms: job.specialisms || [],
    offeredSalary: job.offeredSalary || '',
    city: job.city || '',
    country: job.country || '',
    applicationDeadline: job.applicationDeadline?.substring(0, 10) || '', // date format
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.put(`/employee/job/${job._id}`, form, {
        withCredentials: true,
      });

      alert('Job updated successfully');
      navigate('/employee/manage-jobs'); // or wherever your list is
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to update job');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Job: {form.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Example input fields */}
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Job Title" />
        <input name="company" value={form.company} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Company" />
        <input name="location" value={form.location} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Location" />
        <input name="offeredSalary" value={form.offeredSalary} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Salary" />
        <input name="jobType" value={form.jobType} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Job Type" />
        <input name="careerLevel" value={form.careerLevel} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Career Level" />
        <input name="experience" value={form.experience} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Experience" />
        <input name="qualification" value={form.qualification} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Qualification" />
        <input name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Gender" />
        <input name="industry" value={form.industry} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Industry" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
        <input name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Deadline" />
        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Job</button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
