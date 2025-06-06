import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
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
      const res = await apiClient.get('/get-shortlisted-jobs', { withCredentials: true });
      setJobs(res.data.shortlistedJobs || []);
    } catch (err) {
      setErrorJobs(err.response?.data?.error || 'Failed to load shortlisted jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchShortlistedJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
  };

  const openJobDetail = async (jobID) => {
    setLoadingJobDetail(true);
    setErrorJobDetail('');
    setSelectedJobDetail(null);

    try {
      const res = await apiClient.post('/jobs/get-job-detail', {
        jobID,
      });
      const data = res?.data?.job;
      if (data) {
        setSelectedJobDetail(data);
      } else {
        setErrorJobDetail('No job details found.');
      }
    } catch (err) {
      console.error('Error fetching job detail:', err);
      setErrorJobDetail('Failed to load job details.');
    } finally {
      setLoadingJobDetail(false);
    }
  };

  const closeJobDetailModal = () => {
    setSelectedJobDetail(null);
    setErrorJobDetail('');
  };

  if (loadingJobs) return <div className="text-center p-8">Loading shortlisted jobs...</div>;
  if (errorJobs) return <div className="text-red-600 text-center p-8">{errorJobs}</div>;

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        No shortlisted jobs available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Jobs You've Been Shortlisted For</h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.jobID}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleJobClick(job)}
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm mt-1">Location: {job.location}</p>
            <p className="text-sm mt-1">Job Description: {job.description.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={closeJobModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Job Details for {selectedJob.title}</h3>

            <div className="space-y-4">
              <p><strong>Company:</strong> {selectedJob.company}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Description:</strong> {selectedJob.description}</p>

              {selectedJob.applicationDeadline && (
                <p><strong>Application Deadline:</strong> {selectedJob.applicationDeadline}</p>
              )}

              <button
                onClick={() => {
                  closeJobModal();
                  openJobDetail(selectedJob.jobID);
                }}
                className="text-indigo-600 hover:text-indigo-800 p-2"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedJobDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeJobDetailModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close job detail modal"
            >
              <X size={20} />
            </button>

            {loadingJobDetail && <p className="text-gray-700">Loading job details...</p>}

            {errorJobDetail && <p className="text-red-500">{errorJobDetail}</p>}

            {!loadingJobDetail && !errorJobDetail && selectedJobDetail && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">Full Job Details</h2>

                <div>
                  <p><span className="font-semibold">Job Title:</span> {selectedJobDetail.title}</p>
                  <p><span className="font-semibold">Company:</span> {selectedJobDetail.company}</p>
                  <p><span className="font-semibold">Location:</span> {selectedJobDetail.location}</p>
                  <p><span className="font-semibold">Job Description:</span> {selectedJobDetail.description}</p>
                </div>

                <div>
                  <p><span className="font-semibold">Salary Range:</span> {selectedJobDetail.salaryRange}</p>
                  <p><span className="font-semibold">Application Deadline:</span> {selectedJobDetail.applicationDeadline}</p>
                </div>

                {selectedJobDetail.applicationInstructions && (
                  <div>
                    <p><span className="font-semibold">Application Instructions:</span> {selectedJobDetail.applicationInstructions}</p>
                  </div>
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
