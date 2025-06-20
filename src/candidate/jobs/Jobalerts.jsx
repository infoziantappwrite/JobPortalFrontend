import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useUser } from "../../contexts/UserContext";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    try {
      const res = await apiClient.get("/common/job/all", {
        params: { ...filters, page },
      });
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleView = (job) => {
    navigate(`/${user?.userType?.toLowerCase()}/jobdetails`, {
      state: { jobid: job._id },
    });
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen p-6">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Bell className="text-blue-600 w-5 h-5" />
            {user?.userType?.toLowerCase() === "candidate"
              ? "My Job Alerts"
              : "Posted Jobs"}
          </h2>
        </div>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {/* Dynamic filters */}
          {[
            "title",
            "city",
            "specialisms",
          ].map((field) => (
            <input
              key={field}
              type="text"
              value={filters[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Search by ${field}`}
              className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
            />
          ))}

          {/* Dropdowns */}
          {Object.entries(predefinedOptions).map(([field, options]) => (
            <select
              key={field}
              value={filters[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
            >
              <option value="">{`All ${field.charAt(0).toUpperCase() + field.slice(1)}`}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}

          {/* Sorting */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
          >
            <option value="postedAt">Sort by Date</option>
            <option value="offeredSalary">Sort by Salary</option>
            <option value="title">Sort by Title</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleChange("sortOrder", e.target.value)}
            className="bg-blue-50 px-4 py-2 rounded-md text-sm text-gray-700 border border-blue-100"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Job List Header */}
        <div className="hidden sm:grid grid-cols-6 text-sm font-semibold text-blue-700 bg-blue-100 px-6 py-3 rounded-t-lg">
          <div className="col-span-2">Title</div>
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
              className="grid grid-cols-1 sm:grid-cols-6 px-4 py-4 items-start sm:items-center gap-3"
            >
              <div className="col-span-2">
                <p className="font-semibold text-blue-800 flex items-center">
                  <FiBriefcase className="mr-2 text-blue-500" />
                  {job.title}
                </p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
              <div className="text-sm text-gray-700">{job.jobType}</div>
              <div className="text-sm text-gray-700 flex items-center">
                <FiMapPin className="mr-1 text-blue-500" />
                {job.location}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(job.postedAt).toLocaleDateString()}
              </div>
              <div>
                <button
                  onClick={() => handleView(job)}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 text-sm rounded-md hover:from-teal-600 hover:to-blue-700"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-md bg-blue-100 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-md bg-blue-100 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobalerts;
