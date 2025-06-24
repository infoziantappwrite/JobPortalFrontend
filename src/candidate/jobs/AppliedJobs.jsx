/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import {
  Briefcase,
  MapPin,
  Clock,
  FileClock,
  Search,
  RotateCcw,
} from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import InternalLoader from '../../components/InternalLoader';
import JobDetailsModal from './JobDetailsModal';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/candidate/job/get-applied-jobs', { withCredentials: true });
        setJobs(res.data.jobs || []);
        //console.log(res.data.jobs)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const openJobModal = (job) => setSelectedJob(job);
  const closeJobModal = () => setSelectedJob(null);

  if (loading) return <InternalLoader text="Loading Applied Jobs" />;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;
  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={FileClock}
        title="No Applications Yet"
        message="You haven’t applied to any jobs yet. Start exploring and apply to opportunities that match your skills!"
      />
    );
  }

  const filteredJobs = jobs.filter((job) => {
    const lastStage = job.applicationStatus?.[job.applicationStatus.length - 1]?.stage || '';
    const matchesStatus = statusFilter ? lastStage === statusFilter : true;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);



  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading and Search/Filter */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6 w-full max-w-6xl mx-auto">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Briefcase className="text-blue-600 w-5 h-5" />
            Applied Jobs
          </h2>
          
          

          {/* Search + Buttons Container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:max-w-xl">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setHasInteracted(true);
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title, city or specialisms"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex w-full sm:w-auto flex-wrap sm:flex-nowrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setHasInteracted(true);
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 sm:flex-none min-w-[48%] sm:min-w-[unset] px-4 py-2 rounded-md border border-blue-200 text-sm text-gray-700 shadow-sm bg-white"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => {
                  setHasInteracted(false);
                  setStatusFilter('');
                  setSearchQuery('');
                }}
                className="flex-1 sm:flex-none min-w-[48%] sm:min-w-[unset] flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => {
                const latestStageObj = [...job.applicationStatus].sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                const stage = latestStageObj?.stage || '';

                const stageColor = {
                  applied: 'bg-gray-300 text-gray-700',
                  shortlisted: 'bg-blue-100 text-blue-600',
                  interviewed: 'bg-yellow-100 text-yellow-700',
                  offered: 'bg-green-100 text-green-600',
                  rejected: 'bg-red-100 text-red-600',
                };

                return (
                  <div
                    key={job._id}
                    onClick={() => openJobModal(job)}
                    className="bg-gradient-to-br from-white via-blue-50 to-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between h-full"
                  >
                    {/* Title */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                        <Briefcase className="text-teal-600 w-5 h-5" />
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        <Clock className="w-4 h-4" /> {job.jobType}
                      </div>
                    </div>

                    {/* Footer: Stage + Applied Date */}
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                      <p>
                        <strong>Applied At:</strong>{' '}
                        {new Date(job.appliedAt).toLocaleDateString()}
                      </p>
                      {stage && (
                        <span
                          className={`px-3 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${stageColor[stage] || 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-3 items-center flex-wrap text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-600">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>

        ) : (
          <EmptyState
            icon={FileClock}
            title="No Results Found"
            message="No jobs matched your search or filter"
          />

        )}

        {/* Modal */}
        {selectedJob && (
          <JobDetailsModal selectedJob={selectedJob} onClose={closeJobModal} />
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, icon: Icon, value }) => (
  <div>
    <Icon size={16} className="inline text-teal-600 mr-1" />
    <strong>{label}:</strong> {value}
  </div>
);

export default AppliedJobs;
