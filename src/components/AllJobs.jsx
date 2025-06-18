/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { FiMapPin, FiSearch, FiBriefcase } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import JobCards from './JobCards';


const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [lastSeenId, setLastSeenId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(944);


  // Filters
  const [searchText, setSearchText] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobType, setJobType] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryEstimate, setSalaryEstimate] = useState('');
  const [industry, setIndustry] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    resetAndFetch();
  }, [perPage]);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchText, locationFilter, jobType, experienceLevel, datePosted, salaryEstimate, industry]);

  const resetAndFetch = () => {
    setJobs([]);
    setLastSeenId(null);
    setHasMore(true);
    fetchPublicJobs(true);
  };

  const fetchPublicJobs = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = { perPage };
      if (!reset && lastSeenId) payload.lastSeenId = lastSeenId;

      const res = await apiClient.post('common/job/public/all', payload);
      const newJobs = res.data.jobs || [];
      setTotalJobs(res.data.count || totalJobs);

      setJobs((prev) => {
        if (reset) return newJobs;
        const existingIds = new Set(prev.map((j) => j._id));
        const filtered = newJobs.filter((job) => !existingIds.has(job._id));
        return [...prev, ...filtered];
      });

      if (newJobs.length < perPage) {
        setHasMore(false);
      } else {
        setLastSeenId(newJobs[newJobs.length - 1]._id);
      }
    } catch (error) {
      console.error('Failed to fetch public jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];
    if (searchText) {
      result = result.filter((job) =>
        job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (locationFilter) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (jobType) result = result.filter((job) => job.jobType === jobType);
    if (experienceLevel) result = result.filter((job) => job.experience === experienceLevel);
    if (industry) result = result.filter((job) => job.industry === industry);

    // Date posted filter (assumes createdAt is ISO date string)
    if (datePosted) {
      const now = new Date();
      result = result.filter((job) => {
        const created = new Date(job.createdAt);
        const diff = (now - created) / (1000 * 60 * 60 * 24); // in days
        if (datePosted === '1d') return diff <= 1;
        if (datePosted === '1w') return diff <= 7;
        if (datePosted === '1m') return diff <= 30;
        if (datePosted === '6m') return diff <= 180;
        return true;
      });
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  };

 

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filteredJobs.length / perPage);

  return (
    <div className='bg-white pt-10'>
      <div className="text-center mb-10">
        <h1 className="text-4xl pb-2 font-extrabold bg-gradient-to-r from-blue-600  to-teal-600 text-transparent bg-clip-text mb-4">
          Find the Perfect Job That Fits Your Career
        </h1>
        <p className="text-gray-600 text-lg">
          Search. Filter. Apply. Your next opportunity starts here. 🚀
        </p>
      </div>

      {/* Search + Filters UI */}
      <div className="bg-white shadow-md rounded-xl mx-10 p-6 flex flex-wrap gap-4 items-center border border-gray-200 justify-between">
        <div className="flex flex-grow items-center bg-gray-100 px-3 py-2 rounded-md w-full sm:w-auto">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent w-full outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="City or postcode"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-md w-full sm:w-auto"
        />
        <select
          className="bg-gray-100 px-3 py-2 rounded-md w-full sm:w-auto"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">All Industries</option>
          {["Information Technology", "Healthcare", "Finance/Banking", "Education", "Manufacturing", "Retail", "Telecommunications", "Construction", "Energy", "Transportation/Logistics"].map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <button
          className="bg-gradient-to-r from-teal-500 to-blue-800 text-white px-6 py-2 rounded-md"
          onClick={applyFilters}
        >
          Find Jobs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 px-10 py-4 mt-6">
        <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded">
          <option value="">Job Type</option>
          {["Full-time", "Part-time", "Contract", "Internship"].map((opt) => <option key={opt}>{opt}</option>)}
        </select>

        <select value={datePosted} onChange={(e) => setDatePosted(e.target.value)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded">
          <option value="">Date Posted</option>
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="6m">6 Months</option>
        </select>

        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded">
          <option value="">Experience Level</option>
          {["Entry Level", "Mid-Level (Experienced)", "Senior-Level", "Manager", "Executive (C-Level)"].map((opt) => <option key={opt}>{opt}</option>)}
        </select>

        <select value={salaryEstimate} onChange={(e) => setSalaryEstimate(e.target.value)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded">
          <option value="">Salary Estimate (Rand)</option>
          <option>10k - 20k</option>
          <option>20k - 40k</option>
          <option>40k - 60k</option>
          <option>60k - 80k</option>
          <option>80k - Above</option>
        </select>
      </div>

      {/* Jobs List */}


      <div className="px-20  bg-blue-100 min-h-screen">


        <div className="flex flex-col sm:flex-row justify-between  mt-8 gap-4 py-6 ">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <strong>{filteredJobs.length > 0 ? (currentPage - 1) * perPage + 1 : 0}</strong>–<strong>
              {Math.min(currentPage * perPage, filteredJobs.length)}
            </strong>{' '}
            of <strong>{filteredJobs.length}</strong> jobs
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Show</span>
            <select
              className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm"
              value={perPage}
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>
        </div>


        {loading && jobs.length === 0 && <div className="text-center text-gray-500 mt-10">Loading jobs...</div>}
        {!loading && filteredJobs.length === 0 && <div className="text-center text-red-500 mt-10">No jobs found.</div>}
              <JobCards paginatedJobs={paginatedJobs} />


        {/* Pagination */}
        <div className="flex justify-center items-center mx-10 py-6 gap-2">
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
