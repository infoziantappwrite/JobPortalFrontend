import React, { useEffect, useState } from 'react';
import {
  FiEdit, FiTrash2, FiEye, FiCheckSquare,
  FiSquare, FiCheck, FiX
} from 'react-icons/fi';
import apiClient from '../api/apiClient';
import { fetchCurrentUser } from '../api/fetchuser';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import InternalLoader from './InternalLoader';
import JobAlertHeader from '../candidate/jobs/JobAlertHeader';
import EmptyState from './EmptyState';

const predefinedOptions = {
  gender: ["Any", "Male", "Female", "Other"],
  location: ["Remote", "In-person", "Hybrid"],
  experience: ["0-1 Years", "1-2 Years", "5-10 Years", "10+ Years"],
  jobType: ["Full-time", "Part-time", "Contract", "Internship"],
  qualification: [
    "Bachelor’s Degree",
    "Master’s Degree",
    "Doctorate (Ph.D.)",
    "Professional Certification",
    "Associate Degree",
  ],
  industry: [
    "Information Technology",
    "Healthcare",
    "Finance/Banking",
    "Education",
    "Manufacturing",
    "Retail",
    "Telecommunications",
    "Construction",
    "Energy",
    "Transportation/Logistics",
  ],
};

const JobListCompany = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    range: "all", 
    status: "all",
    title: "",
    location: "",
    gender: "",
    experience: "",
    qualification: "",
    jobType: "",
    careerLevel: "",
    industry: "",
    city: "",
    specialisms: "",
    sortBy: "postedAt",
    sortOrder: "desc",
  });

  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const fetchedUser = await fetchCurrentUser();
      setUser(fetchedUser);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchJobs = async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    setError('');

    try {
      const res = await apiClient.get('/common/job/all', {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      let fetchedJobs = res.data.jobs || [];

      if (filters.range !== 'all') {
        const now = new Date();
        const minutesMap = {
          '5min': 5,
          '1w': 60 * 24 * 7,
          '1m': 60 * 24 * 30,
          '3m': 60 * 24 * 90,
          '6m': 60 * 24 * 180,
        };
        const minutes = minutesMap[filters.range];
        fetchedJobs = fetchedJobs.filter(job => {
          const createdAt = new Date(job.postedAt);
          const diff = (now - createdAt) / (1000 * 60);
          return diff <= minutes;
        });
      }

      if (filters.status !== 'all') {
        fetchedJobs = fetchedJobs.filter(job =>
          filters.status === 'active' ? job.isActive : !job.isActive
        );
      }

      setJobs(fetchedJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchJobs(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [filters]);

  const handleChange = (field, value) => {
    setHasInteracted(true);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === jobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobs.map(j => j._id));
    }
  };

  const handleDelete = async () => {
    try {
      for (let id of selectedIds) {
        await apiClient.delete(`/company/job/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }
      alert('Deleted successfully');
      setConfirmDelete(false);
      setSelectedIds([]);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job(s).');
    }
  };

  const handleViewJob = (job) => {
    const relatedJobs = jobs.filter(j => j.companyID === job.companyID && j._id !== job._id);
    navigate('/company/jobdetails', {
      state: { jobdetails: job, relatedJobs },
    });
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      {/* Background track */}
      <div
        className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300
          peer-checked:bg-blue-600 transition-colors duration-300`}
      />
      {/* Knob */}
      <div
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow
          transform transition-transform duration-300
          peer-checked:translate-x-5`}
      />
    </label>
  );



  const toggleJobStatus = async (jobId, newStatus) => {
  try {
    await apiClient.patch(`/common/job/change-status/${jobId}`, 
      { isActive: newStatus },  // assuming your API expects this in body
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    // Update the job status locally for immediate UI feedback
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job._id === jobId ? { ...job, isActive: newStatus } : job
      )
    );
  } catch (error) {
    alert('Failed to update job status');
    console.error(error);
  }
};


  const role = user?.role?.toLowerCase();
  const userId = String(user?._id || user?.id || '').trim();
  const companyId = String(user?.companyId || '').trim();

  const canEdit = (job) => {
    const postedById = String(job.postedBy?._id || job.postedBy?.id || '').trim();
    return (
      role !== 'candidate' &&
      (
        userId === postedById ||
        job.companyID === userId ||
        job.companyID === companyId
      )
    );
  };

  if (initialLoading) return <InternalLoader text="Loading Jobs" />;

  if (error) {
    return (
      <div className="text-red-600 text-center font-semibold py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {(hasInteracted || jobs.length > 0) && (
          <JobAlertHeader
            filters={filters}
            handleChange={handleChange}
            user={user}
            predefinedOptions={predefinedOptions}
            setFilters={setFilters}
          />
        )}

        {jobs.length === 0 ? (
          <EmptyState
            title={hasInteracted ? "No Jobs Found" : "No Jobs Available"}
            message={
              hasInteracted
                ? "Try adjusting your filters to see more results."
                : "Come back later to see jobs."
            }
          />
        ) : (
          <>
            {/* Table for desktop */}
            <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-xl mt-6 border">
              <div className="w-full">
                {/* Header row */}
                <div className="grid grid-cols-7 text-sm font-semibold text-blue-700 bg-blue-100 pl-6 py-3 rounded-t-lg">
                  <div className="w-28 flex items-center justify-center">S.No</div>
                  <div className="col-span-2">Title</div>
                  <div>Status</div>
                  <div>Start Date</div>
                  <div>End Date</div>
                  <div>Actions</div>
                </div>


                {/* Job list rows */}
                <div className="divide-y">
                  {jobs.map((job, index) => (
                    <div
                      key={job._id}
                      className="grid grid-cols-1 sm:grid-cols-7 gap-2 px-4 py-3 text-sm items-center"
                    >
                      <div className="flex items-center justify-center font-semibold text-blue-700">
                        {index + 1}
                      </div>
                      <div className="col-span-2 font-medium text-blue-800">{job.title}</div>
                      {/* Status with toggle */}
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <ToggleSwitch
                            checked={job.isActive}
                            onChange={() => toggleJobStatus(job._id, !job.isActive)}
                          />
                          <span className={`ml-2 text-xs font-semibold ${
                            job.isActive ? 'text-blue-700' : 'text-red-500'
                          }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </div>
                      {/* Start Date */}
                      <div>{new Date(job.startDate || job.postedAt).toLocaleDateString()}</div>
                      {/* End Date */}
                      <div>{new Date(job.applicationDeadline).toLocaleDateString()}</div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewJob(job)}
                          title="View"
                          className="text-blue-600"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => canEdit(job) && navigate('/company/jobs-edit', { state: job })}
                          title="Edit"
                          disabled={!canEdit(job)}
                          className={`text-yellow-600 ${!canEdit(job) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FiEdit />
                        </button>
                      </div>
                    </div>
                  ))}


                </div>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden mt-6 space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckbox(job._id);
                      }}
                      title={selectedIds.includes(job._id) ? "Deselect" : "Select"}
                      className="text-blue-600"
                      aria-label={selectedIds.includes(job._id) ? "Deselect job" : "Select job"}
                    >
                      {selectedIds.includes(job._id) ? <FiCheckSquare size={20} /> : <FiSquare size={20} />}
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewJob(job);
                        }}
                        title="View"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canEdit(job)) navigate('/company/jobs-edit', { state: job });
                        }}
                        title={canEdit(job) ? "Edit" : "Cannot Edit"}
                        disabled={!canEdit(job)}
                        className={`text-yellow-600 hover:text-yellow-800 ${
                          !canEdit(job) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FiEdit size={20} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-blue-800 text-lg mt-2">{job.title}</h3>

                  <div className="mt-2 flex flex-wrap gap-2 items-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <strong>Posted:</strong> {new Date(job.postedAt).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <strong>Status:</strong>
                    <ToggleSwitch
                      checked={job.isActive}
                      onChange={() => toggleJobStatus(job._id, !job.isActive)}
                    />
                    <span className={`text-sm font-semibold ${
                        job.isActive ? 'text-blue-700' : 'text-red-500'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {confirmDelete && (
          <ConfirmDeleteModal
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
            count={selectedIds.length}
          />
        )}
      </div>
    </div>
  );
};

export default JobListCompany;
