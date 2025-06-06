import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Eye, X } from 'lucide-react';

const ShortlistedCandidates = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');

  const fetchShortlistedJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await apiClient.get('/jobs/shortlisted-applicants', { withCredentials: true });
      setJobs(res.data.shortlistedApplicants || []);
    } catch (err) {
      setErrorJobs(err.response?.data?.error || 'Failed to load shortlisted candidates.');
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

  const openApplicantDetail = async (applicationID) => {
    setLoadingAppDetail(true);
    setErrorAppDetail('');
    setSelectedApplication(null);

    try {
      const res = await apiClient.post('/jobs/get-detail', {
        IDs: [applicationID],
        type: 'jobApplication',
      });
      const data = res?.data?.jobApplications?.[0];
      if (data) {
        setSelectedApplication(data);
      } else {
        setErrorAppDetail('No application data found.');
      }
    } catch (err) {
      console.error('Error fetching application detail:', err);
      setErrorAppDetail('Failed to load application details.');
    } finally {
      setLoadingAppDetail(false);
    }
  };

  const closeApplicantModal = () => {
    setSelectedApplication(null);
    setErrorAppDetail('');
  };

  if (loadingJobs) return <div className="text-center p-8">Loading shortlisted candidates...</div>;
  if (errorJobs) return <div className="text-red-600 text-center p-8">{errorJobs}</div>;

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        No shortlisted candidates available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Jobs with Shortlisted Candidates</h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.jobId}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleJobClick(job)}
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm mt-1">Shortlisted: {job.applicants?.length || 0}</p>
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

            <h3 className="text-xl font-bold mb-4">Shortlisted Candidates for {selectedJob.title}</h3>

            {selectedJob.applicants.length === 0 ? (
              <p className="text-gray-500">No candidates shortlisted for this job yet.</p>
            ) : (
              <ul className="space-y-3 max-h-[60vh] overflow-auto">
                {selectedJob.applicants.map((applicant, idx) => (
                  <li
                    key={applicant.applicationID || idx}
                    className="p-3 border rounded text-sm flex justify-between items-center hover:bg-gray-100"
                  >
                    <div>
                      <p><strong>Name:</strong> {applicant.userID?.name}</p>
                      <p><strong>Email:</strong> {applicant.userID?.email}</p>
                      <p><strong>Application ID:</strong> {applicant.applicationID}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 border px-2 py-1 rounded">
                        {applicant.status}
                      </span>
                      <button
                        onClick={() => {
                          closeJobModal();
                          openApplicantDetail(applicant.applicationID);
                        }}
                        aria-label={`View details for ${applicant.userID?.name}`}
                        className="text-indigo-600 hover:text-indigo-800 p-2"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeApplicantModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close detail modal"
            >
              <X size={20} />
            </button>

            {loadingAppDetail && <p className="text-gray-700">Loading candidate details...</p>}

            {errorAppDetail && <p className="text-red-500">{errorAppDetail}</p>}

            {!loadingAppDetail && !errorAppDetail && selectedApplication && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">Candidate Details</h2>

                <div>
                  <p><span className="font-semibold">Name:</span> {selectedApplication.userID?.name}</p>
                  <p><span className="font-semibold">Email:</span> {selectedApplication.userID?.email}</p>
                  <p><span className="font-semibold">Role:</span> {selectedApplication.userID?.role}</p>
                  <p><span className="font-semibold">Status:</span> {selectedApplication.status}</p>
                </div>

                <div>
                  <p><span className="font-semibold">Job Title:</span> {selectedApplication.jobID?.title}</p>
                  <p><span className="font-semibold">Company:</span> {selectedApplication.jobID?.company}</p>
                  <p><span className="font-semibold">Location:</span> {selectedApplication.jobID?.location}</p>
                  <p><span className="font-semibold">Description:</span> {selectedApplication.jobID?.description}</p>
                </div>

                {selectedApplication.resumeURL && (
                  <div>
                    <a
                      href={selectedApplication.resumeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
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

export default ShortlistedCandidates;
