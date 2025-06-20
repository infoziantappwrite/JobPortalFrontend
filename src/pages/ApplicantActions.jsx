import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers, FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  BadgeCheck,
  X
} from 'lucide-react';


const bgColors = [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'
];

const statusColors = {
  applied: 'text-gray-600',
  shortlisted: 'text-green-600',
  interviewed: 'text-blue-600',
  offered: 'text-purple-600',
  rejected: 'text-red-600'
};

const statusIcons = {
  applied: { icon: <Clock />, color: 'bg-gray-100 text-gray-700' },
  shortlisted: { icon: <CheckCircle />, color: 'bg-green-100 text-green-700' },
  interviewed: { icon: <BadgeCheck />, color: 'bg-blue-100 text-blue-700' },
  offered: { icon: <ThumbsUp />, color: 'bg-purple-100 text-purple-700' },
  rejected: { icon: <XCircle />, color: 'bg-red-100 text-red-700' },
};

const applicationStatus = Object.freeze({
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  INTERVIEWED: "interviewed",
  OFFERED: "offered",
  REJECTED: "rejected",
});

const getBgColor = (name) => {
  const index = name?.charCodeAt(0) % bgColors.length;
  return bgColors[index];
};

const ApplicantActions = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // For status update modal:
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  

  useEffect(() => {
    const fetchShortlisted = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/employee/job/applicant/get-applicants', { withCredentials: true });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const handleViewApplicants = (jobID) => {
    const job = jobs.find(j => j._id === jobID);
    if (job) setSelectedJob(job);
  };

  const openApplicantDetail = async (applicationID) => {
    if (!selectedJob?._id || !applicationID) return;
    setLoadingAppDetail(true);
    setErrorAppDetail('');
    try {
      const res = await apiClient.post('/employee/job/get-detail', {
        IDs: [applicationID],
        jobID: selectedJob._id,
        type: 'jobApplication',
      }, { withCredentials: true });

      const application = res?.data?.jobApplications?.[0] || null;
      if (!application) {
        setErrorAppDetail('Application details not found.');
        setSelectedApplication(null);
        setIsDetailModalOpen(false);
      } else {
        setSelectedApplication(application);
        setIsDetailModalOpen(true); // 👈 open modal
      }
    } catch (err) {
      setErrorAppDetail(err.response?.data?.error || 'Failed to load applicant detail.');
      setSelectedApplication(null);
      setIsDetailModalOpen(false);
    } finally {
      setLoadingAppDetail(false);
    }
  };

  // Open status modal for an applicant
  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status || applicationStatus.APPLIED);
    setUpdateError('');
    setStatusModalOpen(true);
  };

  // Update applicant status API call
  const handleStatusUpdate = async () => {
  if (!newStatus || !selectedJob?._id || !selectedApplication) return;

  setUpdatingStatus(true);
  setUpdateError('');

  try {
    const applicantID = selectedApplication.candidateID?._id || selectedApplication.candidateID || selectedApplication.applicationID || selectedApplication._id;
    if (!applicantID) {
      setUpdateError('Applicant ID not found.');
      setUpdatingStatus(false);
      return;
    }

    const res = await apiClient.post(
      '/employee/job/applicant/shortlist',
      {
        jobID: selectedJob._id,
        applicantID,
        customStatus: newStatus,
      },
      { withCredentials: true }
    );

    // Update local state
    setSelectedJob(prevJob => {
      if (!prevJob) return prevJob;
      const updatedApplicants = prevJob.applicants.map(applicant => {
        if (applicant.applicationID === selectedApplication.applicationID) {
          return { ...applicant, status: newStatus };
        }
        return applicant;
      });
      return { ...prevJob, applicants: updatedApplicants };
    });

    setJobs(prevJobs => prevJobs.map(job => {
      if (job._id === selectedJob._id) {
        const updatedApplicants = job.applicants.map(applicant => {
          if (applicant.applicationID === selectedApplication.applicationID) {
            return { ...applicant, status: newStatus };
          }
          return applicant;
        });
        return { ...job, applicants: updatedApplicants };
      }
      return job;
    }));

    toast.success(`Applicant status set to '${newStatus}' successfully.`);
    setSelectedApplication(null);
    setStatusModalOpen(false);

  } catch (err) {
    setUpdateError(err.response?.data?.error || 'Failed to update status.');
  } finally {
    setUpdatingStatus(false);
  }
};


  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiUsers className="text-indigo-600" />
           Applicant Actions
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
            <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-black" aria-label="Close Job View">
              <X />
            </button>
          </div>

          {selectedJob.applicants?.length === 0 ? (
            <p className="text-gray-600">No shortlisted applicants for this job.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedJob.applicants.map((applicant, idx) => {
                const name = applicant.candidateID?.name || 'Applicant';
                const email = applicant.candidateID?.email || '';
                const initial = name.charAt(0).toUpperCase();
                const status = applicant.status || applicationStatus.APPLIED;

                return (
                  <div
                    key={applicant.applicationID || idx}
                    className="bg-white p-5 rounded-md shadow-md hover:shadow-lg border"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold ${getBgColor(name)}`}>
                      {initial}
                    </div>
                    <h4 className="text-center font-semibold text-base text-gray-800 mt-2">{name}</h4>
                    <p className="text-sm text-center text-gray-500">{email}</p>

                    {/* Status display */}
                    <p
                      className={`text-center mt-1 font-semibold ${statusColors[status] || 'text-gray-600'}`}
                      title={`Status: ${status}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>

                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => openApplicantDetail(applicant.applicationID)}
                        className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                        title="View Details"
                      >
                        <FiEye />
                      </button>

                      <button
                        onClick={() => openStatusModal(applicant)}
                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-700"
                        title="Change Status"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>


                      {(() => {
                        const iconData = statusIcons[status] || statusIcons.applied;
                        return (
                          <span className={`p-2 rounded ${iconData.color}`} title={status}>
                            {iconData.icon}
                          </span>
                        );
                      })()}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Applicant Detail Modal */}
       {isDetailModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto border border-gray-200">
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  setIsDetailModalOpen(false);
                }}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                aria-label="Close Details"
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

                  {/* Applicant Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Applicant Info</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Name:</strong> {selectedApplication.userID?.name}</p>
                      <p><strong>Email:</strong> {selectedApplication.userID?.email}</p>
                      <p><strong>Status:</strong> 
                        <span className={`ml-1 font-medium ${selectedApplication.status === 'shortlisted' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedApplication.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Job Info */}
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

                  {/* Resume */}
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


      {/* Status Change Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-200">
            <button
              onClick={() => setStatusModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Close Status Modal"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Change Applicant Status</h2>

            {updateError && (
              <p className="text-red-500 mb-3 text-sm">{updateError}</p>
            )}

            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.entries(applicationStatus).map(([key, value]) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {updatingStatus ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantActions;
