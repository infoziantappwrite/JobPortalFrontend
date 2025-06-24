/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { FiFileText, FiCreditCard, FiCheckCircle } from "react-icons/fi";

const EditJob = () => {
  const { state: job } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: job.title || '',
    description: job.description || '',
    company: job.company || '',
    location: job.location || 'Remote',
    jobType: job.jobType || 'Full-time',
    emailAddress: job.emailAddress || '',
    username: job.username || '',
    specialisms: (job.specialisms || []).join(', '),
    offeredSalary: job.offeredSalary || '',
    careerLevel: job.careerLevel || '',
    experience: job.experience || '',
    gender: job.gender || '',
    industry: job.industry || '',
    qualification: job.qualification || '',
    applicationDeadline: job.applicationDeadline?.substring(0, 10) || '',
    country: job.country || '',
    city: job.city || '',
    address: job.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedJob = {
      ...form,
      specialisms: form.specialisms.split(',').map(s => s.trim()),
    };

    try {
      await apiClient.put(`/company/job/${job._id}`, updatedJob, {
        withCredentials: true,
      });

      toast.success('Job updated successfully!');
      navigate('/employee/manage-jobs');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to update job');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-50 flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-xl space-y-10"
      >
        {/* Step Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Edit Job</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Update job information carefully</p>

          <div className="flex justify-center gap-10">
            {[
              { icon: <FiFileText size={20} />, label: 'Job Detail' },
              { icon: <FiCreditCard size={20} />, label: 'Package & Payments' },
              { icon: <FiCheckCircle size={20} />, label: 'Confirmation' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow">
                  {step.icon}
                </div>
                <span className="text-sm mt-2 font-medium text-gray-600">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Field Sections */}
        {[
          { title: "Job Details", fields: ["title", "specialisms", "description"] },
          { title: "Company Information", fields: ["company", "emailAddress", "username"] },
          { title: "Salary & Experience", fields: ["offeredSalary", "careerLevel", "experience", "jobType"] },
          { title: "Requirements", fields: ["gender", "industry", "qualification", "applicationDeadline"] },
          { title: "Job Location", fields: ["country", "city", "address", "location"] },
        ].map((section, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">{section.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                const isTextarea = field === "description";
                const isSelect = ["gender", "location", "jobType", "careerLevel", "qualification", "industry"].includes(field);
                const isDate = field === "applicationDeadline";

                return isSelect ? (
                  <select
                    key={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="input bg-indigo-50"
                  >
                    <option value="">
                      {field === "gender"
                        ? "Gender Preference"
                        : "Select " + field.replace(/([A-Z])/g, " $1")}
                    </option>

                    {field === "gender" &&
                      ["Any", "Male", "Female", "Other"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                    {field === "location" &&
                      ["Remote", "In-person", "Hybrid"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                    {field === "jobType" &&
                      ["Full-time", "Part-time", "Contract", "Internship"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                    {field === "careerLevel" &&
                      ["Entry Level", "Mid-Level (Experienced)", "Senior-Level", "Manager", "Executive (C-Level)"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                    {field === "qualification" &&
                      ["Bachelor’s Degree", "Master’s Degree", "Doctorate (Ph.D.)", "Professional Certification", "Associate Degree"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                    {field === "industry" &&
                      ["Information Technology", "Healthcare", "Finance/Banking", "Education", "Manufacturing", "Retail", "Telecommunications", "Construction", "Energy", "Transportation/Logistics"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                  </select>
                ) : isTextarea ? (
                  <div className="md:col-span-2" key={field}>
                    <textarea
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder="Job Description"
                      className="input h-32 resize-none w-full bg-indigo-50"
                    />
                  </div>
                ) : (
                  <input
                    key={field}
                    name={field}
                    type={isDate ? "date" : "text"}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    className="input bg-indigo-50"
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-auto py-3 px-5 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-indigo-700 transition duration-300"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
