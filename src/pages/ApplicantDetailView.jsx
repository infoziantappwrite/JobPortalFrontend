import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { X, AlertTriangle } from 'lucide-react';
import InternalLoader from '../components/InternalLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../contexts/UserContext';

const ApplicantDetailView = () => {
  const { jobID, applicationID } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useUser();
  const role = user?.userType?.toLowerCase();

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
          `/${role}/job/get-detail`,
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

        {/* Timeline (Applied and latest Shortlisted only) */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">Application Timeline</h3>
          <ol className="relative border-l border-indigo-300 ml-2">
            {(() => {
              if (!status || status.length === 0) {
                return <p className="text-gray-500 italic">No timeline data available.</p>;
              }

              // Find all applied entries (usually one)
              const appliedEntries = status.filter(s => s.stage === 'applied');

              // Find all shortlisted entries, then pick the latest one by createdAt
              const shortlistedEntries = status.filter(s => s.stage === 'shortlisted');
              let latestShortlisted = null;
              if (shortlistedEntries.length > 0) {
                latestShortlisted = shortlistedEntries.reduce((latest, current) => {
                  return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
                });
              }

              // Combine applied + latest shortlisted (if exists)
              const timelineEntries = [...appliedEntries];
              if (latestShortlisted) timelineEntries.push(latestShortlisted);

              // Sort timeline by createdAt ascending (oldest first)
              timelineEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

              return timelineEntries.map(entry => (
                <li key={entry.stage + entry.createdAt} className="mb-6 relative pl-6">
                  <div
                    className="absolute w-3 h-3 rounded-full left-0 top-2 border border-white -translate-x-1/2 bg-indigo-500"
                  ></div>

                  <time className="block mb-1 text-sm font-normal text-gray-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>

                  <p className="text-base font-semibold text-indigo-700 capitalize">
                    {entry.stage}
                  </p>

                  {entry.remarks && (
                    <p className="text-sm text-gray-600 mt-1 italic">Remarks: {entry.remarks}</p>
                  )}
                </li>
              ));
            })()}
          </ol>
        </div>


      </div>
    </div>
  );
};

export default ApplicantDetailView;
