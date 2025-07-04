import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalLoader from '../components/InternalLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  CheckCircle, XCircle, Clock, ThumbsUp, BadgeCheck, X
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
  //console.log(jobs);
  
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const { user } = useUser();
  const role = user?.userType?.toLowerCase();
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = location?.state?.companyId;

  useEffect(() => {
    const fetchShortlisted = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/${role}/job/company-shortlisted/${companyId}`, {
          withCredentials: true
        });

const rawJobs = res.data.shortlistedApplicants || [];
const seen = new Set();

const formattedJobs = rawJobs
  .filter(item => {
    if (seen.has(item.job._id)) {
      return false; // duplicate, skip
    }
    seen.add(item.job._id);
    return true;
  })
  .map(item => ({
    jobId: item.job._id,
    title: item.job.title,
    company: res.data.company.name || 'N/A',
    applicants: item.applicants || []
  }));

        

        setJobs(formattedJobs);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load shortlisted applicants.');
      } finally {
        setLoading(false);
      }
    };

    if (role && companyId) fetchShortlisted();
  }, [role, companyId]);

  const handleViewApplicants = (jobId) => {
    const job = jobs.find(j => j.jobId === jobId);
    if (job) setSelectedJob(job);
  };

const openApplicantDetail = (applicant) => {
  if (!selectedJob?.jobId || !applicant?.candidateID?._id) return;
  navigate(`/${role}/applicant-detail-view/${selectedJob.jobId}/${applicant.candidateID._id}`);
};


  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status || applicationStatus.APPLIED);
    setUpdateError('');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedJob?.jobId || !selectedApplication?.applicationID) return;
    setUpdatingStatus(true);
    setUpdateError('');
    try {
      await apiClient.post(
        `/${role}/job/applicant/shortlist`,
        {
          jobID: selectedJob.jobId,
          applicantID: selectedApplication.candidateID?._id || selectedApplication._id,
          customStatus: newStatus
        },
        { withCredentials: true }
      );

      setJobs(prevJobs => prevJobs.map(job =>
        job.jobId === selectedJob.jobId
          ? {
              ...job,
              applicants: job.applicants.map(app =>
                app.applicationID === selectedApplication.applicationID
                  ? { ...app, status: newStatus }
                  : app
              )
            }
          : job
      ));

      setSelectedJob(prev => ({
        ...prev,
        applicants: prev.applicants.map(app =>
          app.applicationID === selectedApplication.applicationID
            ? { ...app, status: newStatus }
            : app
        )
      }));

      toast.success(`Applicant status set to '${newStatus}'`);
      setStatusModalOpen(false);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <InternalLoader text="Loading Applicants..." />;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold flex items-center gap-2 mb-6 text-indigo-600">
        <FiUsers /> Shortlisted Applicants
      </h2>

      {!selectedJob ? (
        <table className="min-w-full bg-white border rounded-md overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-700 text-left text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">Job Title</th>
              <th className="py-3 px-4 border-b">Company</th>
              <th className="py-3 px-4 border-b">Shortlisted</th>
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {jobs.map(job => (
              <tr key={job.jobId} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.company}</td>
                <td className="py-3 px-4">{job.applicants.length}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewApplicants(job.jobId)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                  >
                    View Shortlisted
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Shortlisted for: <span className="text-indigo-600">{selectedJob.title}</span>
            </h3>
            <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-black">
              <X />
            </button>
          </div>

          {selectedJob.applicants.length === 0 ? (
            <p className="text-gray-600">No applicants found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedJob.applicants.map((applicant, idx) => {
                const name = applicant.candidateID?.name || 'Applicant';
                const email = applicant.candidateID?.email || '';
                const initial = name.charAt(0).toUpperCase();
                const status = applicant.status || applicationStatus.APPLIED;

                return (
                  <div key={idx} className="bg-white p-5 rounded-md shadow border">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold ${getBgColor(name)}`}>
                      {initial}
                    </div>
                    <h4 className="text-center font-semibold text-base text-gray-800 mt-2">{name}</h4>
                    <p className="text-sm text-center text-gray-500">{email}</p>
                    <p className={`text-center mt-1 font-semibold ${statusColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</p>

                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => openApplicantDetail(applicant)}

                        className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                        title="View Details"
                      >
                        <FiEye />
                      </button>

                      <span className={`p-2 rounded ${statusIcons[status]?.color || ''}`}>
                        {statusIcons[status]?.icon}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Status Change Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setStatusModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Change Applicant Status</h2>

            {updateError && <p className="text-red-500 mb-3 text-sm">{updateError}</p>}

            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.entries(applicationStatus).map(([_, value]) => (
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
