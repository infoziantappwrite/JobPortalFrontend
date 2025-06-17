import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers } from 'react-icons/fi';
import { X } from 'lucide-react';

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');
  const [shortlisting, setShortlisting] = useState(false);

  const fetchPostedJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/employee/job/get-applicants', { withCredentials: true });
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const handleViewApplicants = async (jobID) => {
    const job = jobs.find(j => j._id === jobID);
    if (!job) return;
    setSelectedJob(job);
  };

  const openApplicantDetail = async (applicationID) => {
    if (!selectedJob?._id) {
      setErrorAppDetail('Job ID not found.');
      return;
    }

    setLoadingAppDetail(true);
    setErrorAppDetail('');
    setSelectedApplication(null);

    try {
      const res = await apiClient.post('/jobs/get-detail', {
        IDs: [applicationID],
        jobID: selectedJob._id,
        type: 'jobApplication',
      });

      const data = res?.data?.jobApplications?.[0];
      if (data) {
        setSelectedApplication(data);
      } else {
        setErrorAppDetail('No application data found.');
      }
    } catch (err) {
      setErrorAppDetail(err.response?.data?.error || 'Failed to load application details.');
    } finally {
      setLoadingAppDetail(false);
    }
  };

  const handleShortlist = async () => {
    const app = selectedApplication;
    if (!app?._id || !app?.jobID?._id || !app?.userID?._id) {
      alert('Missing data');
      return;
    }

    setShortlisting(true);
    try {
      await apiClient.post('/jobs/shortlist', {
        jobID: app.jobID._id,
        applicantID: app.userID._id,
      });

      setSelectedApplication(null);
      setSelectedJob(null);
      fetchPostedJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not shortlist applicant.');
    } finally {
      setShortlisting(false);
    }
  };

  const closeApplicantModal = () => {
    setSelectedApplication(null);
    setErrorAppDetail('');
  };

  const closeApplicantsListModal = () => {
    setSelectedJob(null);
  };

  if (loading) return <div className="text-center p-8">Loading jobs...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FiUsers /> Posted Jobs with Applicants
      </h2>

      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="min-w-full">
          <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Company</th>
              <th className="py-2 px-4">Posted By</th>
              <th className="py-2 px-4">Applicants</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {jobs.map((job) => (
              <tr key={job._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.company}</td>
                <td className="py-3 px-4">{job.postedBy?.name} ({job.postedBy?.email})</td>
                <td className="py-3 px-4">{job.applicants?.length || 0}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    <FiEye className="inline mr-1" /> View Applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Applicants List */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={closeApplicantsListModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Applicants for {selectedJob.title}</h3>

            {selectedJob.applicants?.length === 0 ? (
              <p className="text-gray-500">No applicants for this job.</p>
            ) : (
              <ul className="space-y-3">
                {selectedJob.applicants.map((applicant, idx) =>
                  applicant.userID ? (
                    <li
                      key={applicant.applicationID || idx}
                      className="p-3 border rounded text-sm flex justify-between items-center hover:bg-gray-100"
                    >
                      <div>
                        <p><strong>{applicant.userID.name}</strong></p>
                        <p className="text-xs text-gray-600">{applicant.userID.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs border px-2 py-1 rounded text-gray-500">
                          {applicant.status}
                        </span>
                        <button
                          onClick={() => openApplicantDetail(applicant.applicationID)}
                          className="text-indigo-600 hover:text-indigo-800 p-2"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </li>
                  ) : (
                    <li key={idx} className="text-gray-500 italic">
                      Anonymous Applicant
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Modal: Applicant Detail */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeApplicantModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {loadingAppDetail && <p>Loading application details...</p>}
            {errorAppDetail && <p className="text-red-500">{errorAppDetail}</p>}

            {!loadingAppDetail && !errorAppDetail && selectedApplication && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">Application Details</h2>

                <div>
                  <p><strong>Name:</strong> {selectedApplication.userID?.name}</p>
                  <p><strong>Email:</strong> {selectedApplication.userID?.email}</p>
                  <p><strong>Role:</strong> {selectedApplication.userID?.role}</p>
                  <p><strong>Status:</strong> {selectedApplication.status}</p>
                </div>

                <div>
                  <p><strong>Job Title:</strong> {selectedApplication.jobID?.title}</p>
                  <p><strong>Company:</strong> {selectedApplication.jobID?.company}</p>
                  <p><strong>Location:</strong> {selectedApplication.jobID?.location}</p>
                  <p><strong>Description:</strong> {selectedApplication.jobID?.description}</p>
                </div>

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

                {selectedApplication.status !== 'shortlisted' && (
                  <div className="pt-4">
                    <button
                      onClick={handleShortlist}
                      disabled={shortlisting}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      {shortlisting ? 'Shortlisting...' : 'Shortlist Applicant'}
                    </button>
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

export default Applicants;
