import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { X, AlertTriangle } from 'lucide-react';
import InternalLoader from '../components/InternalLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const statusOrder = ['applied', 'shortlisted', 'interviewed', 'offered', 'rejected'];

const ApplicantDetailPage = () => {
  const { jobID, applicationID } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Change status states
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiClient.post(
          '/employee/job/get-detail',
          {
            IDs: [applicationID],
            jobID,
            type: 'jobApplication',
          },
          { withCredentials: true }
        );

        const app = res?.data?.jobApplications?.[0] || null;
        if (!app) {
          setError('Application details not found.');
        } else {
          setApplication(app);
          const latestStatus = app?.status?.slice().pop()?.stage || 'applied';
          setNewStatus(latestStatus);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applicant detail.');
      } finally {
        setLoading(false);
      }
    };

    if (jobID && applicationID) fetchApplicationDetail();
  }, [jobID, applicationID]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdatingStatus(true);
    setUpdateError('');
    try {
      const applicantID = application?.userID?._id || application?.userID || applicationID;
      await apiClient.post(
        '/employee/job/applicant/shortlist',
        {
          jobID,
          applicantID,
          customStatus: newStatus,
          remarks,
        },
        { withCredentials: true }
      );
      toast.success(`Status updated to '${newStatus}' successfully.`);
      setRemarks('');
      // Refresh application details to reflect updated timeline
      const refreshed = await apiClient.post(
        '/employee/job/get-detail',
        {
          IDs: [applicationID],
          jobID,
          type: 'jobApplication',
        },
        { withCredentials: true }
      );
      setApplication(refreshed?.data?.jobApplications?.[0] || null);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <InternalLoader text="Loading Applicant Details" />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { userID, jobID: job, resumeURL, status } = application || {};

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
        <button
          className="text-gray-600 hover:text-black"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">Applicant Overview</h2>
          <p className="text-gray-500">Detailed breakdown of the job application</p>
          <div className="h-1 w-24 mx-auto bg-indigo-600 mt-2 rounded-full" />
        </div>

        {/* Applicant & Job Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Applicant Info</h3>
            <p><strong>Name:</strong> {userID?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {userID?.email || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Job Info</h3>
            <p><strong>Title:</strong> {job?.title || 'N/A'}</p>
            <p><strong>Company:</strong> {job?.company || 'N/A'}</p>
            <p><strong>Location:</strong> {[job?.location, job?.city, job?.country].filter(Boolean).join(', ') || 'N/A'}</p>
            <p><strong>Type:</strong> {job?.jobType || 'N/A'}</p>
            <p><strong>Posted:</strong> {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Resume</h3>
          {resumeURL ? (
            <a
              href={resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resume PDF
            </a>
          ) : (
            <p className="text-gray-500 italic">No resume provided</p>
          )}
        </div>

        {/* Change Status Section */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">Update Application Status</h3>

          {updateError && <p className="text-red-500 mb-2 text-sm">{updateError}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              className="w-full p-2 border rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOrder.map(stage => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto"
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </button>
        </div>

        {/* Timeline */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">Application Timeline</h3>
        <ol className="relative border-l border-indigo-300 ml-2">
            {(() => {
            if (!status || status.length === 0) {
                return <p className="text-gray-500 italic">No timeline data available.</p>;
            }

            // Find latest status entry overall by createdAt
            const latestOverallEntry = status.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );

            // Get index of the latest stage in the order array
            const latestStageIndex = statusOrder.indexOf(latestOverallEntry.stage);

            // Filter stages to only those up to latestStageIndex
            const visibleStages = statusOrder.slice(0, latestStageIndex + 1);

            return visibleStages.map(stage => {
                const entries = status.filter(s => s.stage === stage);
                if (entries.length === 0) return null;

                // Latest entry per stage
                const latestEntry = entries.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                );

                return (
                <li key={stage + latestEntry.createdAt} className="mb-6 relative pl-6">
                    <div
                    className="absolute w-3 h-3 rounded-full left-0 top-2 border border-white -translate-x-1/2 bg-indigo-500"
                    ></div>

                    <time className="block mb-1 text-sm font-normal text-gray-400">
                    {new Date(latestEntry.createdAt).toLocaleString()}
                    </time>

                    <p className="text-base font-semibold text-indigo-700 capitalize">
                    {stage}
                    </p>

                    {latestEntry.remarks && (
                    <p className="text-sm text-gray-600 mt-1 italic">Remarks: {latestEntry.remarks}</p>
                    )}
                </li>
                );
            });
            })()}
        </ol>
        </div>


      </div>
    </div>
  );
};

export default ApplicantDetailPage;
