import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiUsers, FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import InternalLoader from '../components/InternalLoader';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../contexts/UserContext';
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

const statusOrder = [
  applicationStatus.APPLIED,
  applicationStatus.SHORTLISTED,
  applicationStatus.INTERVIEWED,
  applicationStatus.OFFERED,
  applicationStatus.REJECTED,
];

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
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  const { user } = useUser();
  const role = user?.userType?.toLowerCase();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShortlisted = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/${role}/job/applicant/get-applicants`, { withCredentials: true });
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
    navigate(`/employee/job/${jobID}/manage-applicants`);
  };

  // Navigation instead of modal
  const openApplicantDetail = (applicationID) => {
    if (!selectedJob?._id || !applicationID) return;

    const applicationIDString = typeof applicationID === 'object' ? applicationID._id : applicationID;

    navigate(`/${role}/applicant-detail-view/${selectedJob._id}/${applicationIDString}`);
  };


  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status || applicationStatus.APPLIED);
    setRemarks('');
    setUpdateError('');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedJob?._id || !selectedApplication) return;

    setUpdatingStatus(true);
    setUpdateError('');
    try {
      const applicantID = selectedApplication.candidateID?._id
        || selectedApplication.candidateID
        || selectedApplication.applicationID
        || selectedApplication._id;
      if (!applicantID) {
        setUpdateError('Applicant ID not found.');
        setUpdatingStatus(false);
        return;
      }

      await apiClient.post(
        `/${role}/job/applicant/shortlist`,
        { jobID: selectedJob._id, applicantID, customStatus: newStatus, remarks },
        { withCredentials: true }
      );

      // Update local state statuses
      const updateFn = job => ({
        ...job,
        applicants: job.applicants.map(a =>
          a.applicationID === selectedApplication.applicationID
            ? { ...a, status: newStatus }
            : a
        )
      });

      setSelectedJob(prev => prev?._id === selectedJob._id ? updateFn(prev) : prev);
      setJobs(prev => prev.map(job => job._id === selectedJob._id ? updateFn(job) : job));

      toast.success(`Applicant status set to '${newStatus}' successfully.`);
      setSelectedApplication(null);
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
          Manage Applicants
        </h2>
      </div>


        {!selectedJob ? (
          <>
            {/* Desktop Table (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-xl mt-6 border">
              <div className="w-full">
                {/* Header */}
                <div className="grid grid-cols-6 text-sm font-semibold text-blue-700 bg-blue-100 pl-6 py-3 rounded-t-lg">
                  <div className="col-span-2">Title</div>
                  <div>Company</div>
                  <div>Posted By</div>
                  <div className="text-center">Applicants</div>
                  <div>Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y">
                  {jobs.map(job => (
                    <div
                      key={job._id}
                      className="grid grid-cols-1 sm:grid-cols-6 gap-2 px-6 py-3 text-sm items-center hover:bg-blue-50 cursor-default"
                    >
                      <div className="col-span-2 font-medium text-blue-800">{job.title}</div>
                      <div>{job.company}</div>
                      <div>{job.postedBy?.name}</div>
                      <div className="text-center text-gray-600 font-semibold">{job.applicants?.length || 0}</div>
                      <div>
                        <button
                          className="inline-block text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 px-4 py-1.5 rounded-lg shadow-md transition-colors duration-300"
                          onClick={() => handleViewApplicants(job._id)}
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Cards (visible only on small screens) */}
            <div className="sm:hidden mt-6 space-y-5 px-2">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-lg p-5 cursor-default hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900 text-xl truncate">{job.title}</h3>
                    <div className="text-sm font-medium text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FiUsers className="text-blue-600" />
                        {job.applicants?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-600 space-y-1 mb-4">
                    <p className="flex items-center gap-2 text-sm">
                      <span className="truncate">{job.company}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      Posted by <span className="font-medium">{job.postedBy?.name || 'N/A'}</span>
                    </p>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-2 rounded-lg shadow-md hover:from-indigo-700 hover:to-teal-600 transition-colors duration-300"
                    onClick={() => handleViewApplicants(job._id)}
                  >
                    View Applicants
                  </button>
                </div>
              ))}
            </div>

          </>
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
                const email = applicant.candidateID?.email || '';
                const initial = name.charAt(0).toUpperCase();
                const status = applicant.status || applicationStatus.APPLIED;

                return (
                  <div key={applicant.applicationID || idx} className="bg-white p-5 rounded-md shadow-md hover:shadow-lg border">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold ${getBgColor(name)}`}>
                      {initial}
                    </div>
                    <h4 className="text-center text-gray-800 font-semibold mt-2">{name}</h4>
                    <p className="text-center text-gray-500 text-sm">{email}</p>
                    <p className={`mt-1 text-center font-semibold ${statusColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                        title="View Details"
                        onClick={() => openApplicantDetail(applicant.applicationID)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-700"
                        title="Change Status"
                        onClick={() => openStatusModal(applicant)}
                      >
                        <FiEdit />
                      </button>
                      {(() => {
                        const data = statusIcons[status] || statusIcons.applied;
                        return <span className={`p-2 rounded ${data.color}`} title={status}>{data.icon}</span>;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setStatusModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Change Applicant Status</h2>

            {updateError && <p className="text-red-500 text-sm mb-3">{updateError}</p>}

            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              {[
                applicationStatus.APPLIED,
                applicationStatus.SHORTLISTED
              ].map(val => (
                <option key={val} value={val}>
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </option>
              ))}
            </select>


            <textarea
              className="w-full p-2 border rounded mb-4 resize-none"
              rows={3}
              placeholder="Enter remarks (optional)"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />

            <button
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
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
