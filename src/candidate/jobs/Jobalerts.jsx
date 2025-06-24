import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useUser } from "../../contexts/UserContext";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobAlertHeader from "./JobAlertHeader";
import InternalLoader from "../../components/InternalLoader";
import { SearchX, Eye } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import Pagination from "../../pages/hooks/Pagination";

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

const Jobalerts = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [filters, setFilters] = useState({
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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/common/job/all', {
        params: { ...filters, page },
      });
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const handleChange = (field, value) => {
    setHasInteracted(true);
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleView = (job) => {
    navigate(`/${user?.userType?.toLowerCase()}/jobdetails`, {
      state: { jobid: job._id },
    });
  };

  // Show loader while fetching
  if (loading && !hasInteracted) {
    return <InternalLoader text="Loading Jobs" />;
  }


  // Show error if any
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6">
      {(hasInteracted || jobs.length > 0) && (
        <JobAlertHeader
          filters={filters}
          handleChange={handleChange}
          user={user}
          predefinedOptions={predefinedOptions}
          setFilters={setFilters}
        />
      )}

      {jobs.length > 0 ? (
        <>
          <div className="bg-white  rounded-xl shadow-xl w-full max-w-6xl mx-auto">
            {/* Job List Header */}
            <div className="hidden sm:grid grid-cols-7 text-sm font-semibold text-blue-700 bg-blue-100 pl-8 py-4 rounded-t-lg">
              <div className="col-span-2">Title</div>
              <div>Company</div>
              <div>Type</div>
              <div>Location</div>
              <div>Posted</div>
              <div>Action</div>
            </div>

            {/* Job Items */}
            <div className="divide-y">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="grid grid-cols-1 sm:grid-cols-7 px-6 py-3 items-start sm:items-center gap-3"
                >
                  <div className="col-span-2">
                    <p
                      onClick={() => handleView(job)}
                      className="font-semibold text-blue-800 hover:underline cursor-pointer"
                    >
                      {job.title}
                    </p>
                  </div>
                  <div className="text-sm text-gray-700">{job.company}</div>
                  <div className="text-sm text-gray-700">{job.jobType}</div>
                  <div className="text-sm text-gray-700 flex items-center">
                    <FiMapPin className="mr-1 text-blue-500" />
                    {job.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                  <div className="ml-0 lg:ml-4">
                    <button
                      onClick={() => handleView(job)}
                      className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                      title="View Job"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
          </div>
          <div>

            {totalPages > 1 && (
              <div className="">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}

          </div>
        </>
      ) : hasInteracted ? (
        <div className="min-h-96 flex flex-col justify-center items-center text-center text-gray-600 bg-gradient-to-br from-teal-50 to-blue-50  px-6">
          <SearchX className="w-12 h-12 mb-4 text-teal-500" />
          <h2 className="text-xl font-semibold mb-2">No Jobs Found</h2>
          <p className="text-sm text-gray-500">Try adjusting your filters to see more results or search with other words.</p>
        </div>
      ) : (
        <EmptyState

          title="No Jobs Available"
          message="Come later to see jobs"
        />
      )}
    </div>
  );
};

export default Jobalerts;
