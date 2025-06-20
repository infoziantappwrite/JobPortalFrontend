/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
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
        console.log(res.data.jobs)
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

  if (loading) return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-700 font-medium text-lg">Loading Applied Jobs...</p>
      </div>
    </div>
  );

  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  if (jobs.length === 0) {
    return <div className="text-center text-gray-600 p-8">You have not applied to any jobs yet.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">My Applied Jobs</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Detail row
const Detail = ({ label, icon: Icon, value }) => (
  <div>
    <Icon size={16} className="inline text-teal-600 mr-1" />
    <strong>{label}:</strong> {value}
  </div>
);

export default AppliedJobs;
