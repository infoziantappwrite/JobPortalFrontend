import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/jobs/get-applicants', { withCredentials: true });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Posted Jobs with Applicants</h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleJobClick(job)}
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">
              {job.company}
            </p>
            <p className="text-sm mt-1">Applicants: {job.applicants?.length || 0}</p>
            {job.postedBy && (
              <p className="text-xs text-gray-500 mt-2">
                Posted by: <span className="font-medium">{job.postedBy.name}</span> ({job.postedBy.email})
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Modal for Applicants */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Applicants for {selectedJob.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {selectedJob.applicants.length === 0 ? (
              <p className="text-gray-500">No applicants for this job yet.</p>
            ) : (
              <ul className="space-y-3">
                {selectedJob.applicants.map((applicant, index) => {
                  if (applicant.userID) {
                    return (
                      <li key={index} className="p-3 border rounded text-sm">
                        <p><strong>User ID:</strong> {applicant.userID}</p>
                        <p><strong>Application ID:</strong> {applicant.applicationID}</p>
                      </li>
                    );
                  }

                  return (
                    <li key={index} className="p-3 border rounded text-sm text-gray-500 italic">
                      Anonymous Applicant (Buffer only)
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
