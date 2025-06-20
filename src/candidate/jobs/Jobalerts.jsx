import React, { useState, useEffect } from 'react';
import { FiMapPin, FiBriefcase } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Bell } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const Jobalerts = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/common/job/all');
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    return (
      (locationFilter === '' || job.location === locationFilter) &&
      (jobTypeFilter === '' || job.jobType === jobTypeFilter)
    );
  });

  const handleView = (job) => {
    navigate(`/${user?.userType?.toLowerCase()}/jobdetails`, {
      state: { jobid: job._id },
    });
  };

  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];
  const uniqueTypes = [...new Set(jobs.map((job) => job.jobType))];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
        <span className="text-gray-700 font-medium">Loading jobs...</span>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6 sm:p-6 ">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Bell className="text-blue-600 w-5 h-5" />
            {user?.userType?.toLowerCase() === 'candidate' ? 'My Job Alerts' : 'Posted Jobs'}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              className="bg-blue-100 px-4 py-2 rounded-md text-sm text-gray-700"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>

            <select
              className="bg-blue-100 px-4 py-2 rounded-md text-sm text-gray-700"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-6 items-center text-sm font-semibold text-blue-700 bg-blue-100 px-6 py-3 rounded-t-lg">
          <div className="col-span-2">Title</div>
          <div>Type</div>
          <div>Location</div>
          <div>Posted On</div>
          <div>Action</div>
        </div>

        {/* Job List */}
        <div className="divide-y">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="grid grid-cols-1 sm:grid-cols-6 items-start sm:items-center gap-2 px-4 py-4"
            >
              <div className="col-span-2">
                <p className="font-semibold text-blue-800 flex items-center">
                  <FiBriefcase className="mr-2 text-blue-500" />
                  {job.title}
                </p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>

              <div className="text-sm text-gray-700">{job.jobType || 'N/A'}</div>

              <div className="text-sm text-gray-700 flex items-center">
                <FiMapPin className="mr-1 text-blue-500" />
                {job.location}
              </div>

              <div className="text-sm text-gray-600">
                {new Date(job.postedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </div>

              <div>
                <button
                  onClick={() => handleView(job)}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:from-teal-600 hover:to-blue-700 transition"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Jobs */}
        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No jobs match your selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobalerts;
