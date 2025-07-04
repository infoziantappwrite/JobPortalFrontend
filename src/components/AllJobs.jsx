/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import apiClient from "../api/apiClient";
import JobCards from "./JobCards";
import Pagination from "../pages/hooks/Pagination";
import InternalLoader from "./InternalLoader";
import { Undo2, AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";
import { useSearchParams, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

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

const AllJobs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [filtersReady, setFiltersReady] = useState(false);

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

  useEffect(() => {
    const initial = {
      title: searchParams.get("title") || "",
      location: "",
      specialisms: searchParams.get("skills") || "",
      gender: "",
      experience: "",
      qualification: "",
      jobType: "",
      careerLevel: "",
      industry: "",
      city: searchParams.get("city") || "",
      sortBy: "postedAt",
      sortOrder: "desc",
    };
    setFilters(initial);
    setFiltersReady(true);
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/common/job/public/all", {
        params: { ...filters, page, limit },
      });
      const { jobs = [], pagination = {} } = res.data;
      setJobs(jobs);
      setTotalPages(pagination.totalPages || 1);
      setTotalJobs(pagination.total || 0);
      setError("");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Something went wrong while loading your Page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filtersReady) {
      fetchJobs();
    }
  }, [filters, page, limit]);

  const debouncedChange = useCallback(
    debounce(async (field, value) => {
      setSearching(true);
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
      setSearching(false);
    }, 600),
    []
  );

  useEffect(() => {
    return () => debouncedChange.cancel();
  }, [debouncedChange]);

  const handleChange = (field, value) => {
    debouncedChange(field, value);
  };

  const handleReset = () => {
    const defaultFilters = {
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
    };
    setFilters(defaultFilters);
    setPage(1);
    navigate("/jobs");
  };

  if (loading && !searching) return <InternalLoader text="Loading Jobs" />;
  if (error) return <EmptyState icon={AlertTriangle} title="Oops! Something Went Wrong" message={error} />;

  return (
    <div className="bg-white pt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold pb-2 text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mb-2">
          Find the Perfect Job That Fits Your Career
        </h1>
        <p className="text-gray-600 text-lg">Search. Filter. Apply. Your next opportunity starts here. 🚀</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-xl mx-4 md:mx-10 p-6 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between border border-blue-100">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md flex-grow w-full md:w-auto">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            defaultValue={filters.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
          />
          {searching && (
            <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <input
          type="text"
          placeholder="City"
          defaultValue={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md w-full md:w-auto placeholder-gray-500"
        />

        <input
          type="text"
          placeholder="Skills"
          defaultValue={filters.specialisms}
          onChange={(e) => handleChange("specialisms", e.target.value)}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md w-full md:w-auto placeholder-gray-500"
        />

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-700 text-white font-semibold px-6 py-2 w-full md:w-auto text-center rounded-md hover:shadow-md transition"
        >
          <Undo2 className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-6 md:px-10 py-6">
        {["jobType", "gender", "experience", "qualification", "location", "industry"].map((field) => (
          <select
            key={field}
            value={filters[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-blue-50 text-blue-800 px-4 py-2 rounded-md border border-blue-100 text-sm shadow-sm"
          >
            <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}</option>
            {predefinedOptions[field]?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Results */}
      <div className="px-4 sm:px-10 lg:px-20 bg-blue-100 min-h-screen">
        <div className="mt-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:flex md:justify-between md:items-center">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <p className="text-sm text-blue-800 font-medium bg-white px-4 py-2.5 border-blue-200 rounded-md shadow-sm border w-full md:w-auto">
              Showing{" "}
              <span className="font-semibold text-teal-600">{jobs.length ? (page - 1) * limit + 1 : 0}</span> to{" "}
              <span className="font-semibold text-teal-600">{(page - 1) * limit + jobs.length}</span> of{" "}
              <span className="font-semibold text-blue-600">{totalJobs}</span> jobs
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Show</span>
              <select
                className="px-3 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                {[8, 12, 16, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              className="px-4 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md"
            >
              <option value="postedAt">Sort by Date</option>
              <option value="offeredSalary">Sort by Salary</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => handleChange("sortOrder", e.target.value)}
              className="px-4 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-center text-gray-600 px-6">
            <h2 className="text-xl font-semibold mb-2">No Job Found</h2>
            <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <JobCards paginatedJobs={jobs} />
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      </div>
    </div>
  );
};

export default AllJobs;
