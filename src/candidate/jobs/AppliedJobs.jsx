/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import {
  Briefcase,
  MapPin,
  Clock,
  X,
  Building2,
  Calendar,
  Mail,
  Tags,
  DollarSign,
  User,
  GraduationCap,
  Globe,
  Locate,
  BookOpen,
  Users,
  FileClock,
  Search,
  Filter,
  RotateCcw,
  Bell,

} from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import InternalLoader from '../../components/InternalLoader';

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
        console.log(res.data.jobs)
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
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => openJobModal(job)}
                  className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="text-teal-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                      <Clock className="w-4 h-4" /> {job.jobType}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {job.description?.substring(0, 120)}...
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded border border-blue-300 text-blue-700 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded border border-blue-300 text-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>) : (
          <EmptyState
            icon={FileClock}
            title="No Results Found"
            message="No jobs matched your search or filter"
          />

        )}

        {/* Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex justify-center items-center px-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-xl p-6 overflow-y-auto max-h-[90vh] relative shadow-xl">
              <button
                onClick={closeJobModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Job Title & Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Briefcase className="text-teal-600" size={18} />
                  {selectedJob.title}
                </h2>
                <p className="text-gray-700 mb-1 flex items-center gap-1">
                  <Building2 className="text-teal-600" size={16} />
                  {selectedJob.company}
                </p>
                <p className="text-gray-600 mt-3 leading-relaxed border-t pt-4 text-justify">
                  {selectedJob.description}
                </p>
              </div>

              {/* Job Details */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Job Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-sm">
                  <Detail label="Location" icon={MapPin} value={selectedJob.location} />
                  <Detail label="Type" icon={Clock} value={selectedJob.jobType} />
                  <Detail label="Email" icon={Mail} value={selectedJob.emailAddress} />
                  <Detail label="Specialisms" icon={Tags} value={selectedJob.specialisms?.join(', ') || 'N/A'} />
                  <Detail label="Salary" icon={DollarSign} value={selectedJob.offeredSalary || 'N/A'} />
                  <Detail label="Career Level" icon={User} value={selectedJob.careerLevel || 'N/A'} />
                  <Detail label="Experience" icon={Clock} value={selectedJob.experience || 'N/A'} />
                  <Detail label="Gender" icon={Users} value={selectedJob.gender || 'N/A'} />
                  <Detail label="Industry" icon={Globe} value={selectedJob.industry || 'N/A'} />
                  <Detail label="Qualification" icon={GraduationCap} value={selectedJob.qualification || 'N/A'} />
                  <Detail label="Deadline" icon={Calendar} value={new Date(selectedJob.applicationDeadline).toLocaleDateString()} />
                  <Detail label="Country" icon={Locate} value={selectedJob.country || 'N/A'} />
                  <Detail label="City" icon={MapPin} value={selectedJob.city || 'N/A'} />
                  <Detail label="Address" icon={BookOpen} value={selectedJob.address || 'N/A'} />
                </div>
              </div>
             
              {/* Application Status Timeline */}
{selectedJob.applicationStatus && selectedJob.applicationStatus.length > 0 && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Application Timeline</h3>
    <ol className="relative border-l border-blue-300 ml-2">
      {selectedJob.applicationStatus.map((stage, index) => (
        <li key={stage._id} className="mb-6 ml-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
          <time className="block mb-1 text-sm font-normal leading-none text-gray-400">
            {new Date(stage.createdAt).toLocaleString()}
          </time>
          <p className="text-base font-medium text-blue-700 capitalize">
            {stage.stage}
          </p>
          {stage.remarks && (
            <p className="text-sm text-gray-600 mt-1">
              {stage.remarks}
            </p>
          )}
        </li>
      ))}
    </ol>
  </div>
)}

            </div>
            
          </div>
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
