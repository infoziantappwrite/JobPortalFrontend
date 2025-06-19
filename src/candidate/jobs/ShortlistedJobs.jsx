import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { Eye, X } from 'lucide-react';

const ShortlistedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);

  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [loadingJobDetail, setLoadingJobDetail] = useState(false);
  const [errorJobDetail, setErrorJobDetail] = useState('');

  const fetchShortlistedJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await apiClient.get('/candidate/job/get-shortlisted-jobs', { withCredentials: true });
      setJobs(res.data.jobs || []);
    } catch (err) {
      setErrorJobs(err.response?.data?.error || 'Failed to load shortlisted jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchShortlistedJobs();
  }, []);

  const handleJobClick = (job) => setSelectedJob(job);
  const closeJobModal = () => setSelectedJob(null);

  const openJobDetail = async (jobID) => {
    setLoadingJobDetail(true);
    setErrorJobDetail('');
    setSelectedJobDetail(null);
    try {
      const res = await apiClient.post('/jobs/get-job-detail', { jobID });
      const data = res?.data?.job;
      if (data) setSelectedJobDetail(data);
      else setErrorJobDetail('No job details found.');
    } catch {
      setErrorJobDetail('Failed to load job details.');
    } finally {
      setLoadingJobDetail(false);
    }
  };

  const closeJobDetailModal = () => {
    setSelectedJobDetail(null);
    setErrorJobDetail('');
  };

  if (loadingJobs) return <div className="text-center p-10 text-indigo-600 font-medium">Loading shortlisted jobs...</div>;
  if (errorJobs) return <div className="text-red-600 text-center p-8">{errorJobs}</div>;

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        You haven’t been shortlisted for any jobs yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-gradient mb-8">
        Shortlisted Jobs
      </h2>

      <ul className="grid sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-5 group"
            onClick={() => handleJobClick(job)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-900">
                {job.title}
              </h3>
              <Eye size={20} className="text-teal-500" />
            </div>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-600 mt-1">📍 {job.location}</p>
            <p className="text-sm mt-2 text-gray-800">
              {(job.description && job.description.length > 100)
                ? job.description.slice(0, 100) + '...'
                : job.description || 'N/A'}
            </p>
          </li>
        ))}
      </ul>

      {/* Modal: Job Summary */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeJobModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
              {selectedJob.title}
            </h3>
            <div className="space-y-3 text-sm text-gray-800">
              <p><strong>Company:</strong> {selectedJob.company}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              {selectedJob.applicationDeadline && (
                <p><strong>Deadline:</strong> {selectedJob.applicationDeadline}</p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition"
                onClick={() => openJobDetail(selectedJob._id)}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Full Job Details */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeJobDetailModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close job detail modal"
            >
              <X size={22} />
            </button>

            {loadingJobDetail && (
              <p className="text-gray-700">Loading job details...</p>
            )}

            {errorJobDetail && (
              <p className="text-red-500">{errorJobDetail}</p>
            )}

            {!loadingJobDetail && !errorJobDetail && (
              <div className="space-y-4 text-sm text-gray-800">
                <h2 className="text-xl font-semibold text-indigo-700">Job Details</h2>
                <p><strong>Title:</strong> {selectedJobDetail.title}</p>
                <p><strong>Company:</strong> {selectedJobDetail.company}</p>
                <p><strong>Location:</strong> {selectedJobDetail.location}</p>
                <p><strong>Description:</strong> {selectedJobDetail.description}</p>
                <p><strong>Salary Range:</strong> {selectedJobDetail.salaryRange || 'N/A'}</p>
                <p><strong>Deadline:</strong> {selectedJobDetail.applicationDeadline || 'N/A'}</p>
                {selectedJobDetail.applicationInstructions && (
                  <p><strong>How to Apply:</strong> {selectedJobDetail.applicationInstructions}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortlistedJobs;
