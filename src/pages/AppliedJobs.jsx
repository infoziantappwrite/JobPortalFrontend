import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/jobs/applied', { withCredentials: true });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <div className="text-center p-8">Loading applied jobs...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        You have not applied to any jobs yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Applied Jobs</h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-700 mt-1">{job.company}</p>
            <p className="text-gray-500 text-sm mt-1">
              Location: {job.location} | Type: {job.jobType}
            </p>
            <p className="mt-2 text-gray-600">{job.description.substring(0, 120)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppliedJobs;
