import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { Eye, X,ArchiveX } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import InternalLoader from '../../components/InternalLoader';

const ShortlistedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/candidate/job/get-shortlisted-jobs', { withCredentials: true });
        console.log(res.data)
        setJobs( []);
      } catch {
        setError('Failed to load shortlisted jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openDetail = async (jobID) => {
    setDetailLoading(true);
    setSelectedJobDetail(null);
    try {
      const res = await apiClient.post('/jobs/get-job-detail', { jobID });
      setSelectedJobDetail(res.data.job);
    } catch {
      setSelectedJobDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) return <InternalLoader text="Loading Shortlisted jobs"/>;
  if (error) return (<div className="text-red-600 text-center">{error}</div>);



  if (jobs.length === 0) {
  return (
    <EmptyState
  icon={ArchiveX}
  title="No Shortlisted Jobs"
  message="You haven't shortlisted any jobs yet. Explore and save jobs you like!"
/>
  );
}


  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6 sm:p-8">
      <h2 className="text-3xl font-semibold text-center text-blue-800 mb-8">Shortlisted Jobs</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, i) => (
          <div
            key={job._id}
            onClick={() => setSelectedJob(job)}
            className={`
              relative group p-6 rounded-2xl border
              ${i % 2 === 0 ? 'bg-white/30 border-white/20' : 'bg-white/20 border-white/10'}
              backdrop-blur-md shadow-inner shadow-white/20 cursor-pointer
            `}
          >
            <Eye className="absolute top-4 right-4 text-teal-600 opacity-70 group-hover:opacity-100" size={20} />
            <h3 className="text-lg font-bold text-blue-800 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-600 mt-2">📍 {job.location}</p>
            <p className="text-gray-700 text-sm mt-4 line-clamp-3">
              {job.description?.slice(0, 120)}...
            </p>
          </div>
        ))}
      </div>

      {/* Summary Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 bg-white/70 p-2 rounded-full"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-blue-800">{selectedJob.title}</h3>
              <p className="text-sm text-gray-700 mt-1">📍 {selectedJob.location}</p>
            </div>
            <p className="text-gray-800 text-sm mb-4">{selectedJob.description}</p>
            <button
              onClick={() => openDetail(selectedJob._id)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-xl p-6 overflow-auto relative">
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute top-4 right-4 bg-white/70 p-2 rounded-full"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Job Details</h2>
            {detailLoading
              ? <p className="text-gray-600">Loading details...</p>
              : (
                <div className="space-y-3 text-sm text-gray-800">
                  <Detail label="Title" value={selectedJobDetail.title} />
                  <Detail label="Company" value={selectedJobDetail.company} />
                  <Detail label="Location" value={selectedJobDetail.location} />
                  <Detail label="Description" value={selectedJobDetail.description} />
                  <Detail label="Salary" value={selectedJobDetail.salaryRange || 'N/A'} />
                  <Detail label="Deadline" value={selectedJobDetail.applicationDeadline || 'N/A'} />
                  <Detail label="Apply Instructions" value={selectedJobDetail.applicationInstructions || 'N/A'} />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <p><strong>{label}:</strong> {value}</p>
);

export default ShortlistedJobs;
