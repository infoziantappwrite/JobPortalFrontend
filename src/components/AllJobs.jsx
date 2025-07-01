/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FiMapPin, FiSearch, FiBriefcase } from "react-icons/fi";
import apiClient from "../api/apiClient";
import JobCards from "./JobCards";
import Pagination from '../pages/hooks/Pagination';
import InternalLoader from "./InternalLoader";
import { Search, Undo2,AlertTriangle } from 'lucide-react';
import EmptyState from "./EmptyState";



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


  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setlimit] = useState(8);
  const [totaljobs, setTotaljobs] = useState();
  const [loading, setLoading] = useState(true);
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
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get("/common/job/public/all", {
        params: { ...filters, page, limit },
      });
      //console.log(res.data);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotaljobs(res.data.pagination?.total || 1);
      setLoading(false);
      setError('');
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Something went wrong while loading your Page.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, page, limit]);

  const handleChange = (field, value) => {
    setHasInteracted(true);
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (loading && !hasInteracted && !error) {
    return <InternalLoader text="Loading Jobs" />;
  } 
    if (error) {
    return (
     
        <EmptyState
          icon={AlertTriangle}
          title="Oops! Something Went Wrong"
          message={error}
        />
    );
  }
  




  return (
    <div className="bg-white pt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold pb-2 text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mb-2">
          Find the Perfect Job That Fits Your Career
        </h1>
        <p className="text-gray-600 text-lg">
          Search. Filter. Apply. Your next opportunity starts here. 🚀
        </p>
      </div>

      {/* Primary Filters Section */}
      <div className="bg-white shadow-lg rounded-xl mx-4 md:mx-10 p-6 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between border border-blue-100">
        {/* Title Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md flex-grow w-full md:w-auto">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={filters.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* City Input */}
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md w-full md:w-auto placeholder-gray-500"
        />

        {/* Specialisms Input */}
        <input
          type="text"
          placeholder="Skills"
          value={filters.specialisms}
          onChange={(e) => handleChange("specialisms", e.target.value)}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md w-full md:w-auto placeholder-gray-500"
        />

        {/* Search Button */}
        
 

  <button
    onClick={() =>
      setFilters({
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
      })
    }
    className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-700 text-white font-semibold px-6 py-2 w-full md:w-auto text-center rounded-md hover:shadow-md transition"
>
    <Undo2 className="w-4 h-4" />
    Reset 
  </button>

      </div>

      {/* Additional Filters Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-6 md:px-10 py-6">
        {[
          "jobType",
          "gender",
          "experience",
          "qualification",
          "location",
          "industry"
        ].map((field) => (
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



      {/* Pagination Header */}
      <div className="px-4 sm:px-10 lg:px-20 bg-blue-100 min-h-screen">
        {/* Header: Showing + Sorting */}
        <div className="mt-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:flex md:justify-between md:items-center">
          {/* Job Count + Show Limit */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg w-full md:w-auto">
            <p className="text-sm text-blue-800 font-medium bg-white px-4 py-2.5 border-blue-200 rounded-md shadow-sm border w-2/3  md:w-auto">
              Showing{" "}
              <span className="font-semibold text-teal-600">
                {jobs.length > 0 ? (page - 1) * limit + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-teal-600">
                {(page - 1) * limit + jobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-blue-600">{totaljobs}</span> jobs
            </p>

            <div className="flex items-center gap-2 ">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Show</span>
              <select
                className="px-3 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limit}
                onChange={(e) => {
                  setlimit(parseInt(e.target.value));
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

          {/* Sort By + Sort Order */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg w-full md:w-auto">
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              className="flex-1 min-w-[140px] px-4 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="postedAt">Sort by Date</option>
              <option value="offeredSalary">Sort by Salary</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => handleChange("sortOrder", e.target.value)}
              className="flex-1 min-w-[120px] px-4 py-2 text-sm text-blue-700 bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>


        {/* Job Cards */}
        {jobs.length === 0 ? (
          <div className=" flex flex-col justify-center items-center text-center text-gray-600 b  px-6">
      
      <h2 className="text-xl font-semibold mb-2">No Job Found</h2>
      <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
      </div>
        ) : (
          <JobCards paginatedJobs={jobs} />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

    </div>
  );
};

export default AllJobs;
