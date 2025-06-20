import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiBriefcase,
  FiUser,
  FiBookmark,
  FiCalendar,
} from 'react-icons/fi';
import { Banknote } from 'lucide-react';
import apiClient from '../api/apiClient';

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
    const formattedTitle = job.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    const relatedJobs = jobs.filter(
      (j) => j.company === job.company && j._id !== job._id
    );

    navigate(`/job/${formattedTitle}`, {
      state: {
        jobdetails: job,
        relatedJobs,
      },
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        No active job postings found.
      </div>
    );
  }

  return (
    <div className="mt-12 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => handleNavigate(job)}
            className="cursor-pointer bg-blue-50/70 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg uppercase shadow">
                {job.company?.[0] || 'C'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">{job.company}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <FiMapPin className="text-blue-500" /> {job.location || 'Remote'}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs font-medium mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                {job.jobType || 'Full Time'}
              </span>
              {job.specialisms?.[0] && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {job.specialisms[0]}
                </span>
              )}
              {job.experience && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  {job.experience}
                </span>
              )}
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiUser className="text-blue-600" />
                <span>{job.careerLevel || 'Any Level'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                <span>{job.industry || 'Industry'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBookmark className="text-blue-600" />
                <span>{job.qualification || 'Not Specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-blue-600" />
                <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsAtCompany;
