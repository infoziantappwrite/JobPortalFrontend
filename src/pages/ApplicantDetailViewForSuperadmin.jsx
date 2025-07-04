import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { X, AlertTriangle } from 'lucide-react';
import InternalLoader from '../components/InternalLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../contexts/UserContext';

const statusOrder = ['applied', 'shortlisted', 'interviewed', 'offered', 'rejected'];

const ApplicationDetailView = () => {
    const { jobID, applicationID } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useUser();
    const role = user?.userType?.toLowerCase();

    const [newStatus, setNewStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        const fetchApplicationDetail = async () => {
            setLoading(true);
            setError('');

            try {
                let res;

                if (role === 'superadmin') {
                    res = await apiClient.post(
                        '/superadmin/job/applicant-details',
                        { candidateID: applicationID, jobID },
                        { withCredentials: true }
                    );
                    //console.log('Response from superadmin:', res.data);

                    const app = res?.data?.application;
                    if (!app) {
                        setError('Application details not found.');
                    } else {
                        setApplication({
                            ...app,
                            userID: res?.data?.candidate,
                            jobID: res?.data?.job,
                            company: res?.data?.company
                        });
                        const latestStatus = app?.status?.slice().pop()?.stage || 'applied';
                        setNewStatus(latestStatus);
                    }
                } else {
                    res = await apiClient.post(
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
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load applicant detail.');
            } finally {
                setLoading(false);
            }
        };

        if (role && jobID && applicationID) {
            fetchApplicationDetail();
        }
    }, [role, jobID, applicationID]);

    const handleStatusUpdate = async () => {
        if (!newStatus) return;

        setUpdatingStatus(true);
        setUpdateError('');
        try {
            const applicantID = application?.userID?._id || application?.userID || applicationID;

            await apiClient.post(
                `/${role}/job/applicant/shortlist`,
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

            setTimeout(async () => {
                const refreshed = await apiClient.post(
                    `/${role}/job/get-detail`,
                    {
                        IDs: [applicationID],
                        jobID,
                        type: 'jobApplication',
                    },
                    { withCredentials: true }
                );
                setApplication(refreshed?.data?.jobApplications?.[0] || null);
            }, 500);
        } catch (err) {
            setUpdateError(err.response?.data?.error || 'Failed to update status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

  const goToFullProfile = () => {
  const candidateID = application?.userID?._id || applicationID;
  if (!jobID || !candidateID) return;
  navigate(`/${role}/applicant-detail-edit/full-profile/${jobID}/${candidateID}`);
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

    const { userID, jobID: job, resumeURL, status, company } = application || {};

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
                <button className="text-gray-600 hover:text-black" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-indigo-700 mb-2">Applicant Overview</h2>
                    <p className="text-gray-500">Detailed breakdown of the job application</p>
                    <div className="h-1 w-24 mx-auto bg-indigo-600 mt-2 rounded-full" />
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:space-x-6">
                    <div className="w-full sm:w-1/2 space-y-2">
                        <h3 className="text-lg font-semibold text-indigo-600">Applicant Info</h3>
                        <p><strong>Name:</strong> {userID?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {userID?.email || 'N/A'}</p>
                        <button
                            onClick={goToFullProfile}
                            className="mt-3 inline-block px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition"
                        >
                            View Full Profile
                        </button>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-2 mt-6 sm:mt-0">
                        <h3 className="text-lg font-semibold text-indigo-600">Job Info</h3>
                        <p><strong>Title:</strong> {job?.title || 'N/A'}</p>
                        <p><strong>Company:</strong> {company?.name || job?.company?.name || 'N/A'}</p>
                        <p><strong>Location:</strong> {[job?.location, job?.city, job?.country].filter(Boolean).join(', ') || 'N/A'}</p>
                        <p><strong>Type:</strong> {job?.jobType || 'N/A'}</p>
                        <p><strong>Posted:</strong> {job?.postedAt? new Date(job.postedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">Resume</h3>
                    {resumeURL ? (
                        <a
                            href={resumeURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-5 py-2 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-md hover:bg-indigo-600 hover:text-white transition"
                        >
                            View Resume PDF
                        </a>
                    ) : (
                        <p className="text-gray-500 italic">No resume provided</p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-4">Application Timeline</h3>
                    <ol className="relative border-l border-indigo-300 ml-2">
                        {(() => {
                            if (!status || status.length === 0) {
                                return <p className="text-gray-500 italic">No timeline data available.</p>;
                            }
                            const latestOverallEntry = status.reduce((latest, current) =>
                                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                            );
                            const latestStageIndex = statusOrder.indexOf(latestOverallEntry.stage);
                            const visibleStages = statusOrder.slice(0, latestStageIndex + 1);
                            return visibleStages.map(stage => {
                                const entries = status.filter(s => s.stage === stage);
                                if (entries.length === 0) return null;
                                const latestEntry = entries.reduce((latest, current) =>
                                    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                                );
                                return (
                                    <li key={stage + latestEntry.createdAt} className="mb-6 relative pl-6">
                                        <div className="absolute w-3 h-3 rounded-full left-0 top-2 border border-white -translate-x-1/2 bg-indigo-500" />
                                        <time className="block mb-1 text-sm font-normal text-gray-400">
                                            {new Date(latestEntry.createdAt).toLocaleString()}
                                        </time>
                                        <p className="text-base font-semibold text-indigo-700 capitalize">{stage}</p>
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

export default ApplicationDetailView;


