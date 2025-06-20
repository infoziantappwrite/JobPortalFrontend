import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers } from 'react-icons/fi';
import { CheckCircle, X } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const bgColors = [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'
];

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

  useEffect(() => {
    const fetchShortlisted = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/employee/job/applicant/shortlisted-applicants', { withCredentials: true });
        setJobs(res.data.shortlistedApplicants || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load shortlisted applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const handleViewApplicants = (jobID) => {
    const job = jobs.find(j => j.jobId === jobID);
    if (job) setSelectedJob(job);
  };

  const openApplicantDetail = async (applicationID) => {
    if (!selectedJob?.jobId) return;
    setLoadingAppDetail(true);
    try {
      const res = await apiClient.get('/candidate/info/get-profile', {withCredentials: true});
      setSelectedApplication(res?.data?.applicant || null);
    } catch (err) {
      setErrorAppDetail(err.response?.data?.error || 'Failed to load applicant detail.');
    } finally {
      setLoadingAppDetail(false);
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
          Shortlisted Applicants
        </h2>
      </div>

      {!selectedJob ? (
        <div className="overflow-x-auto bg-white rounded-md shadow-md border">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
              <tr>
                <th className="text-left py-3 px-5 border-b">Title</th>
                <th className="text-left py-3 px-5 border-b">Company</th>
                <th className="text-left py-3 px-5 border-b">Shortlisted</th>
                <th className="text-left py-3 px-5 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {jobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-5">{job.title}</td>
                  <td className="py-3 px-5">{job.company}</td>
                  <td className="py-3 px-5">{job.applicants?.length || 0}</td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleViewApplicants(job.jobId)}
                      className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded"
                    >
                      View Shortlisted
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
              Shortlisted for <span className="text-indigo-600">{selectedJob.title}</span>
            </h3>
            <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-black">
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
                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => openApplicantDetail(applicant.applicationID)}
                        className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <span className="p-2 bg-green-100 rounded text-green-700" title="Shortlisted">
                        <CheckCircle />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button onClick={() => setSelectedApplication(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X />
            </button>
            <h4 className="text-xl font-semibold mb-4">Applicant Details</h4>
            {loadingAppDetail ? (
              <p>Loading...</p>
            ) : errorAppDetail ? (
              <p className="text-red-500">{errorAppDetail}</p>
            ) : (
              <div>
                <div className="mb-2"><strong>Name:</strong> {selectedApplication.name}</div>
                <div className="mb-2"><strong>Email:</strong> {selectedApplication.email}</div>
                <div className="mb-2"><strong>Phone:</strong> {selectedApplication.phone}</div>
                <div className="mb-2"><strong>Skills:</strong> {selectedApplication.skills?.join(', ') || 'N/A'}</div>
                <div className="mb-2"><strong>Experience:</strong> {selectedApplication.experience || 'N/A'} years</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortlistedCandidates;
