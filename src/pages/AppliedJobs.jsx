import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { X } from 'lucide-react';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store the selected job object for modal
  const [selectedJob, setSelectedJob] = useState(null);

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

  const openJobModal = (job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Applied Jobs</h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openJobModal(job)}
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

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeJobModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close job detail modal"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Full Job Details</h2>

            <div className="space-y-2">
              <p><span className="font-semibold">Job Title:</span> {selectedJob.title}</p>
              <p><span className="font-semibold">Company:</span> {selectedJob.company}</p>
              <p><span className="font-semibold">Location:</span> {selectedJob.location}</p>
              <p><span className="font-semibold">Job Type:</span> {selectedJob.jobType}</p>
              <p><span className="font-semibold">Description:</span> {selectedJob.description}</p>
              <p><span className="font-semibold">Email Address:</span> {selectedJob.emailAddress}</p>
              <p><span className="font-semibold">Specialisms:</span> {selectedJob.specialisms?.join(', ') || 'N/A'}</p>
              <p><span className="font-semibold">Offered Salary:</span> {selectedJob.offeredSalary || 'N/A'}</p>
              <p><span className="font-semibold">Career Level:</span> {selectedJob.careerLevel || 'N/A'}</p>
              <p><span className="font-semibold">Experience:</span> {selectedJob.experience || 'N/A'}</p>
              <p><span className="font-semibold">Gender:</span> {selectedJob.gender || 'N/A'}</p>
              <p><span className="font-semibold">Industry:</span> {selectedJob.industry || 'N/A'}</p>
              <p><span className="font-semibold">Qualification:</span> {selectedJob.qualification || 'N/A'}</p>
              <p><span className="font-semibold">Application Deadline:</span> {new Date(selectedJob.applicationDeadline).toLocaleDateString() || 'N/A'}</p>
              <p><span className="font-semibold">Country:</span> {selectedJob.country || 'N/A'}</p>
              <p><span className="font-semibold">City:</span> {selectedJob.city || 'N/A'}</p>
              <p><span className="font-semibold">Address:</span> {selectedJob.address || 'N/A'}</p>

              {selectedJob.postedBy && (
                <>
                  <p><span className="font-semibold">Posted By:</span> {selectedJob.postedBy.name} ({selectedJob.postedBy.role})</p>
                  <p><span className="font-semibold">Contact Email:</span> {selectedJob.postedBy.email}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
