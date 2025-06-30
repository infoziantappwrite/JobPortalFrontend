import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers, FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalLoader from '../components/InternalLoader';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';
import Pagination from './hooks/Pagination';
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

const ShortlistedCandidates = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');

  // For status update modal:
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const location = useLocation();
  const companyId = location?.state?.companyId;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const { user } = useUser();
  const role = user?.userType?.toLowerCase();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShortlisted = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/${role}/job/applicant/shortlisted-applicants`, {
          params: { page },  
          withCredentials: true,
        });
        setJobs(res.data.shortlistedApplicants || []);
        setTotalPages(res.data.pagination?.totalPages || 1);  
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load shortlisted applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, [page]);  


  const handleViewApplicants = (jobID) => {
    navigate(`/${role}/job/${jobID}/shortlisted-applicants`);
  };

  // Navigation instead of modal
  const openApplicantDetail = (applicationID) => {
    if (!selectedJob?.jobId || !applicationID) return;
    navigate(`/${role}/applicant-detail-edit/${selectedJob.jobId}/${applicationID}`);
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
    if (!newStatus || !selectedJob?.jobId || !selectedApplication?.applicationID) return;
    setUpdatingStatus(true);
    setUpdateError('');
    try {
      const res = await apiClient.post(
        `/${role}/job/applicant/shortlist`,
        {
          jobID: selectedJob.jobId,
          applicantID: selectedApplication.candidateID?._id || selectedApplication.candidateID || selectedApplication._id,
          customStatus: newStatus,
        },
        { withCredentials: true }
      );

      // Update the local applicant status in selectedJob applicants and selectedApplication
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

      setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : prev);

      // Also update the jobs array state so it persists if user goes back
      setJobs(prevJobs => prevJobs.map(job => {
        if (job.jobId === selectedJob.jobId) {
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
      setStatusModalOpen(false);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
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
          Shortlisted Applicants
        </h2>
      </div>

        {!selectedJob ? (
          <>
            {/* Desktop Table (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-xl mt-6 border border-gray-200">
              <div className="w-full">
                {/* Header */}
                <div className="grid grid-cols-7 text-sm font-semibold text-blue-700 bg-blue-100 pl-6 py-3 rounded-t-lg select-none">
                  <div className="col-span-2">Title</div>
                  <div className="text-left">Status</div> {/* Adjusted Status to the left */}
                  <div>Company</div>
                  <div>Posted By</div>
                  <div className="text-center">Applicants</div>
                  <div>Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-200">
                  {jobs.map((job) => {
                    // Determine the job status based on the `isActive` field
                    const jobStatus = job.isActive ? "Active" : "Inactive";
                    return (
                      <div
                        key={job._id}
                        className="grid grid-cols-7 gap-2 px-6 py-3 text-sm items-center hover:bg-blue-50 transition-colors cursor-default"
                      >
                        <div className="col-span-2 font-medium text-blue-900 truncate">{job.title}</div>

                        {/* Job Status Column with better left alignment */}
                        <div className={`text-left font-semibold ${job.isActive ? 'text-blue-700' : 'text-red-600'}`}>
                          {jobStatus}
                        </div>

                        <div className="text-gray-700 truncate">{job.company}</div>
                        <div className="text-gray-700 truncate">{job.postedBy?.name || 'N/A'}</div>
                        <div className="text-center text-gray-600 font-semibold">{job.applicants?.length || 0}</div>

                        {/* Actions - View Shortlisted Button */}
                        <div>
                          <button
                            className="inline-block text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 px-4 py-1.5 rounded-lg shadow-md transition-colors duration-300 whitespace-nowrap"
                            onClick={() => handleViewApplicants(job.jobId)}
                          >
                            View Shortlisted
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Cards (visible only on small screens) */}
            <div className="sm:hidden mt-6 space-y-5 px-2">
              {jobs.map((job) => {
                // Determine the job status based on the `isActive` field
                const jobStatus = job.isActive ? "Active" : "Inactive";
                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-lg p-5 cursor-default hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-900 text-xl truncate">{job.title}</h3>
                      <div className="text-sm font-medium text-gray-500 inline-flex items-center gap-1">
                        <FiUsers className="text-blue-600" />
                        {job.applicants?.length || 0}
                      </div>
                    </div>

                    {/* Status for Mobile */}
                    <div className="flex items-center justify-between mb-3">
                      {/* Job Status Column */}
                      <span
                        className={`text-sm font-semibold ${job.isActive ? 'text-blue-700' : 'text-red-600'}`}
                      >
                        {jobStatus}
                      </span>
                    </div>

                    <div className="text-gray-600 space-y-1 mb-4">
                      <p className="text-sm truncate">{job.company}</p>
                      <p className="text-sm">
                        Posted by <span className="font-medium">{job.postedBy?.name || 'N/A'}</span>
                      </p>
                    </div>

                    <button
                      className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-2 rounded-lg shadow-md hover:from-indigo-700 hover:to-teal-600 transition-colors duration-300"
                      onClick={() => handleViewApplicants(job.jobId)}
                    >
                      View Shortlisted
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        ) : (


        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Shortlisted for <span className="text-indigo-600">{selectedJob.title}</span>
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
      {selectedApplication && !statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto border border-gray-200">
            <button
              onClick={() => setSelectedApplication(null)}
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

export default ShortlistedCandidates;
