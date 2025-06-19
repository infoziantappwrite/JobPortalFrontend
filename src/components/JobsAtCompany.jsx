import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock } from 'react-icons/fi';

const JobsAtCompany = ({ companyId }) => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get(`/common/company/${companyId}/jobs`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Failed to load jobs', err);
      }
    };

    if (companyId) fetchJobs();
  }, [companyId]);

  const handleNavigate = (job) => {
    const formattedTitle = job.title.toLowerCase().replace(/\s+|\/+/g, '-');
    const relatedJobs = jobs.filter(j => j.company === job.company && j._id !== job._id);
    navigate(`/job/${formattedTitle}`, {
      state: {
        jobdetails: job,
        relatedJobs
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">Jobs at this Company</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No active job postings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-xl p-4 bg-gray-50 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleNavigate(job)}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                {job.title}
              </h3>

              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiMapPin className="text-indigo-500" />
                {job.location} • {job.jobType}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <FiBriefcase className="inline-block mr-1" />
                {job.careerLevel} | {job.experience}
              </p>

              <p className="text-sm mt-2 text-green-600 font-medium">
                💰 {job.offeredSalary}
              </p>

              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <FiClock className="text-gray-400" />
                Apply before {new Date(job.applicationDeadline).toDateString()}
              </p>

              <div className="mt-4">
                <button
                  onClick={() => handleNavigate(job)}
                  className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsAtCompany;
