import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FiEye, FiUsers } from 'react-icons/fi';
import { UserPlus, X } from 'lucide-react';

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);
  const [errorAppDetail, setErrorAppDetail] = useState('');
  const [shortlisting, setShortlisting] = useState(false);

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
      const res = await apiClient.get('/candidate/info/get-profile', {
        params: {
          applicantID: applicationID,
          jobID: selectedJob._id
        }
      });
      setSelectedApplication(res?.data?.applicant || null);
    } catch (err) {
      setErrorAppDetail(err.response?.data?.error || 'Failed to load application details.');
    } finally {
      setLoadingAppDetail(false);
    }
  };

const handleShortlist = async (applicant, jobID) => {
  console.log('Applicant:', applicant);
  console.log('Job ID:', jobID);

  // Extract applicantID from candidateID._id
  let applicantID = null;

  if (typeof applicant.candidateID === 'string') {
    applicantID = applicant.candidateID;
  } else if (applicant.candidateID?._id) {
    applicantID = applicant.candidateID._id;
  } else if (applicant._id) {
    applicantID = applicant._id;
  }

  if (!applicantID || !jobID) {
    console.warn('Missing applicantID or jobID', { applicantID, jobID });
    alert("Invalid applicant data. Missing jobID or applicantID.");
    return;
  }

  setShortlisting(true);
  try {
    const res = await apiClient.post(
      '/employee/job/applicant/shortlist',
      {
        jobID,
        applicantID,
      },
      { withCredentials: true }
    );

    console.log('Shortlist response:', res.data);

    setSelectedApplication(null);
    setSelectedJob(null);
  } catch (err) {
    console.error('Shortlist failed:', err.response?.data || err.message);
    alert(err.response?.data?.error || 'Could not shortlist applicant.');
  } finally {
    setShortlisting(false);
  }
};






  if (loading) return <div className="text-center py-10">Loading jobs...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiUsers className="text-indigo-600" />
          Applicants
        </h2>
      </div>

      {!selectedJob ? (
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
              {jobs.map(job => (
                <tr key={job._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-indigo-700">{job.title}</td>
                  <td className="py-3 px-4">{job.company}</td>
                  <td className="py-3 px-4">{job.postedBy?.name}</td>
                  <td className="py-3 px-4">{job.applicants?.length || 0}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewApplicants(job._id)}
                      className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
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
              {selectedJob.applicants.map((applicant, idx) => (
                <div
                  key={applicant.applicationID || idx}
                  className="bg-white p-5 rounded-md shadow-md hover:shadow-lg border"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.userID?.name}`}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <h4 className="text-center font-semibold text-base text-gray-800">{applicant.userID?.name}</h4>
                  <p className="text-sm text-center text-indigo-600">{applicant.userID?.role || 'Applicant'}</p>
                  <p className="text-sm text-center text-gray-500">{applicant.userID?.email}</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      onClick={() => openApplicantDetail(applicant.applicationID)}
                      className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                      title="View"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleShortlist(applicant, selectedJob._id)}
                      className="p-2 bg-indigo-100 rounded hover:bg-indigo-200 text-indigo-700"
                      title="Shortlist"
                      disabled={shortlisting}
                    >
                      <UserPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto">
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
                <h2 className="text-xl font-bold text-indigo-700 mb-4">Application Details</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Name:</strong> {selectedApplication.userID?.name}</p>
                  <p><strong>Email:</strong> {selectedApplication.userID?.email}</p>
                  <p><strong>Status:</strong> {selectedApplication.status}</p>
                </div>
                <a
                  href={selectedApplication.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline block mt-4"
                >
                  View Resume
                </a>
                {selectedApplication.status !== 'shortlisted' && (
                  <button
                    onClick={() => handleShortlist(selectedApplication, selectedJob._id)}
                    disabled={shortlisting}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
                  >
                    {shortlisting ? 'Shortlisting...' : 'Shortlist Applicant'}
                  </button>

                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
