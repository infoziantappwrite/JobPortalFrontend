import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers } from 'react-icons/fi';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalLoader from '../components/InternalLoader';
const bgColors = [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'
];

const getBgColor = (name) => {
  const index = name?.charCodeAt(0) % bgColors.length;
  return bgColors[index];
};

const applicationStatus = Object.freeze({
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  INTERVIEWED: "interviewed",
  OFFERED: "offered",
  REJECTED: "rejected",
});

const statusOrder = [
  applicationStatus.APPLIED,
  applicationStatus.SHORTLISTED,
  applicationStatus.INTERVIEWED,
  applicationStatus.OFFERED,
  applicationStatus.REJECTED,
];

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');

  useEffect(() => {
    const fetchPostedJobs = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/employee/job/applicant/get-applicants', { withCredentials: true });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchPostedJobs();
  }, []);

  const handleViewApplicants = (jobID) => {
    const job = jobs.find(j => j._id === jobID);
    if (job) setSelectedJob(job);
  };

  const openApplicantDetail = async (applicationID) => {
    if (!selectedJob?._id) return;
    setLoadingAppDetail(true);
    try {
      const res = await apiClient.post('/employee/job/get-detail', {
        IDs: [applicationID],
        jobID: selectedJob._id,
        type: 'jobApplication',
      });
      setSelectedApplication(res?.data?.jobApplications?.[0] || null);
    } catch (err) {
      setErrorAppDetail(err.response?.data?.error || 'Failed to load application details.');
    } finally {
      setLoadingAppDetail(false);
    }
  };

  if (loading) return <InternalLoader text="Loading Applicants" />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiUsers className="text-indigo-600" />
          Applicants
        </h2>
      </div>

      {!selectedJob ? (
        <div className="overflow-x-auto bg-white rounded-md shadow-md border">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
              <tr>
                <th className="text-left py-3 px-5 border-b">Title</th>
                <th className="text-left py-3 px-5 border-b">Company</th>
                <th className="text-left py-3 px-5 border-b">Posted By</th>
                <th className="text-left py-3 px-5 border-b">Applicants</th>
                <th className="text-left py-3 px-5 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-5">{job.title}</td>
                  <td className="py-3 px-5">{job.company}</td>
                  <td className="py-3 px-5">{job.postedBy?.name}</td>
                  <td className="py-3 px-5">{job.applicants?.length || 0}</td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleViewApplicants(job._id)}
                      className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded"
                    >
                      View Applicants
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Applicants for <span className="text-indigo-600">{selectedJob.title}</span>
            </h3>
            <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-black">
              <X />
            </button>
          </div>

          {selectedJob.applicants?.length === 0 ? (
            <p className="text-gray-600">No applicants for this job.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedJob.applicants.map((applicant, idx) => {
                const name = applicant.candidateID?.name || 'Applicant';
                const initial = name.charAt(0).toUpperCase();
                const email = applicant.candidateID?.email || '';
                const status = applicant.status;

                return (
                  <div
                    key={applicant.applicationID || idx}
                    className="bg-white p-5 rounded-md shadow-md hover:shadow-lg border"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold ${getBgColor(name)}`}>
                      {initial}
                    </div>
                    <h4 className="text-center font-semibold text-base text-gray-800 mt-2">{name}</h4>
                    <p className="text-sm text-center text-indigo-600">{applicant.candidateID?.role || 'Applicant'}</p>
                    <p className="text-sm text-center text-gray-500">{email}</p>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => openApplicantDetail(applicant.applicationID)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded transition"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto border border-gray-200">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {loadingAppDetail ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : errorAppDetail ? (
              <p className="text-center text-red-500">{errorAppDetail}</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Application Details</h2>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Applicant Info</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Name:</strong> {selectedApplication.userID?.name}</p>
                    <p><strong>Email:</strong> {selectedApplication.userID?.email}</p>
                  </div>
                </div>

                <div className="mb-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Info</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Title:</strong> {selectedApplication.jobID?.title}</p>
                    <p><strong>Company:</strong> {selectedApplication.jobID?.company}</p>
                    <p><strong>Location:</strong> {selectedApplication.jobID?.location}, {selectedApplication.jobID?.city}, {selectedApplication.jobID?.country}</p>
                    <p><strong>Type:</strong> {selectedApplication.jobID?.jobType}</p>
                    <p><strong>Posted At:</strong> {new Date(selectedApplication.jobID?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-6 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Resume</h3>
                  <a
                    href={selectedApplication.resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume PDF
                  </a>
                </div>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
