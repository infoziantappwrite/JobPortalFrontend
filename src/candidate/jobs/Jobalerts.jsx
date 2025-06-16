import React, { useState, useEffect } from 'react';
import { FiMapPin, FiBriefcase } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient'; // Adjust the import path as necessary
import { Bell } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // Adjust the import path as necessary

const Jobalerts = () => {
  const navigate = useNavigate();

  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const { user,loading} = useUser(); // ✅ Get user and loading state
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/common/job/all');
        console.log('Fetched jobs:', res.data.jobs);
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
  const relatedJobs = jobs.filter(
    (j) => j.companyID === job.companyID && j._id !== job._id // exclude current job
  );

  const role = user?.userType?.toLowerCase();

  navigate('/jobdetails', {
    state: {
      jobdetails: job,
      relatedJobs: relatedJobs,
    },
  });
};


  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];
  const uniqueTypes = [...new Set(jobs.map((job) => job.jobType))];

  return (
    <div className="bg-blue-50 min-h-screen p-10 flex justify-center items-start">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-7xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Bell className="text-blue-600 w-5 h-5" />
            {user?.userType?.toLowerCase() === 'candidate' ? 'My Job Alerts' : 'Posted Jobs'}
          </h2>

          <div className="flex gap-4">
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

        <div className="grid grid-cols-6 items-center text-sm font-semibold text-blue-700 bg-blue-100 px-8 py-3 rounded-t-lg">
          <div className="col-span-2">Title</div>
          <div >Type</div>
          <div>Location</div>
          <div>Posted On</div>
            <div >Action</div>
        </div>

        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="grid grid-cols-6 items-center text-gray-800 border-b px-2 py-4"
          >
            <div className="col-span-2">
              <p className="font-semibold flex items-center">
                <FiBriefcase className="mr-2 text-blue-500" />
                {job.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">{job.company}</p>
              
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

            <div className="col-span-1">
              <button
               onClick={() => handleView(job)}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-blue-700 transition"
              >
                View Job
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No jobs match your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default Jobalerts;
