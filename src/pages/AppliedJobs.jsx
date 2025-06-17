import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Clock,
  X,
  Mail,
  Tags,
  DollarSign,
  User,
  GraduationCap,
  Globe,
  Locate,
  BookOpen,
  Users,
} from 'lucide-react';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/candidate/job/get-applied-jobs', { withCredentials: true });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const openJobModal = (job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
  };

  if (loading) return <div className="text-center p-8">Loading applied jobs...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  if (jobs.length === 0) {
    return <div className="text-center text-gray-600 p-8">You have not applied to any jobs yet.</div>;
  }

  return (
    <div className="max-w-6xl bg-blue-100 min-h-screen">
    <div className="max-w-5xl mx-auto px-0 py-8 ">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">My Applied Jobs</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => openJobModal(job)}
            className="bg-white border border-indigo-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <MapPin className="w-4 h-4" /> {job.location}
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <Clock className="w-4 h-4" /> {job.jobType}
              </div>
            </div>

            <p className="text-gray-700 text-sm line-clamp-3">
              {job.description.substring(0, 120)}...
            </p>
          </div>
        ))}
      </div>

     {selectedJob && (
  <div className="fixed inset-0 z-50 flex justify-center items-center px-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-3xl rounded-xl p-6 overflow-y-auto max-h-[90vh] relative shadow-lg">
      <button
        onClick={closeJobModal}
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Job Title & Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2 flex items-center gap-2">
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

      {/* Job Detail Grid */}
      <div>
        <h3 className="text-lg font-semibold text-indigo-600 mb-4 border-b pb-2">Job Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-sm">
          <div><MapPin size={16} className="inline text-teal-600 mr-1" /> <strong>Location:</strong> {selectedJob.location}</div>
          <div><Clock size={16} className="inline text-teal-600 mr-1" /> <strong>Type:</strong> {selectedJob.jobType}</div>
          <div><Mail size={16} className="inline text-teal-600 mr-1" /> <strong>Email:</strong> {selectedJob.emailAddress}</div>
          <div><Tags size={16} className="inline text-teal-600 mr-1" /> <strong>Specialisms:</strong> {selectedJob.specialisms?.join(', ') || 'N/A'}</div>
          <div><DollarSign size={16} className="inline text-teal-600 mr-1" /> <strong>Salary:</strong> {selectedJob.offeredSalary || 'N/A'}</div>
          <div><User size={16} className="inline text-teal-600 mr-1" /> <strong>Career Level:</strong> {selectedJob.careerLevel || 'N/A'}</div>
          <div><Clock size={16} className="inline text-teal-600 mr-1" /> <strong>Experience:</strong> {selectedJob.experience || 'N/A'}</div>
          <div><Users size={16} className="inline text-teal-600 mr-1" /> <strong>Gender:</strong> {selectedJob.gender || 'N/A'}</div>
          <div><Globe size={16} className="inline text-teal-600 mr-1" /> <strong>Industry:</strong> {selectedJob.industry || 'N/A'}</div>
          <div><GraduationCap size={16} className="inline text-teal-600 mr-1" /> <strong>Qualification:</strong> {selectedJob.qualification || 'N/A'}</div>
          <div><Calendar size={16} className="inline text-teal-600 mr-1" /> <strong>Deadline:</strong> {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</div>
          <div><Locate size={16} className="inline text-teal-600 mr-1" /> <strong>Country:</strong> {selectedJob.country || 'N/A'}</div>
          <div><MapPin size={16} className="inline text-teal-600 mr-1" /> <strong>City:</strong> {selectedJob.city || 'N/A'}</div>
          <div><BookOpen size={16} className="inline text-teal-600 mr-1" /> <strong>Address:</strong> {selectedJob.address || 'N/A'}</div>
        </div>
      </div>

      {/* Posted By */}
      
    </div>
  </div>
)}


    </div>
    </div>
  );
};

export default AppliedJobs;
