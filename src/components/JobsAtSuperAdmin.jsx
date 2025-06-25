import { useEffect, useState } from 'react';
import {
  FiEye, FiBriefcase, FiFilter, FiCheck, FiX
} from 'react-icons/fi';
import apiClient from '../api/apiClient';
import { fetchCurrentUser } from '../api/fetchuser';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filter, setFilter] = useState({ range: 'all', status: 'all' });
  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const getUser = async () => {
      try {
        const fetchedUser = await fetchCurrentUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filter, jobs, selectedCompany]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await apiClient.get('/common/job/all', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const jobs = res.data.jobs || [];
      setJobs(jobs);

      // Build unique company list from jobs
      const companiesMap = {};
      jobs.forEach(job => {
        if (job.companyID && job.company) {
          companiesMap[job.companyID] = job.company;
        }
      });

      const companyList = Object.entries(companiesMap).map(([id, name]) => ({
        id,
        name,
      }));

      setAllCompanies(companyList);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const applyFilters = () => {
    const now = new Date();
    let filtered = [...jobs];

    // Filter by company
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(job => job.companyID === selectedCompany);
    }

    // Filter by time
    if (filter.range !== 'all') {
      const minutesMap = {
        '5min': 5,
        '1w': 60 * 24 * 7,
        '1m': 60 * 24 * 30,
        '3m': 60 * 24 * 90,
        '6m': 60 * 24 * 180,
      };
      const minutes = minutesMap[filter.range];
      filtered = filtered.filter(job => {
        const createdAt = new Date(job.postedAt);
        const diff = (now - createdAt) / (1000 * 60);
        return diff <= minutes;
      });
    }

    // Filter by status
    if (filter.status !== 'all') {
      filtered = filtered.filter(job =>
        filter.status === 'active' ? job.isActive : !job.isActive
      );
    }

    setFilteredJobs(filtered);
  };

  const handleViewJob = (job) => {
    const relatedJobs = jobs.filter(
      (j) => j.companyID === job.companyID && j._id !== job._id
    );

    navigate('/superadmin/jobdetails', {
      state: {
        jobdetails: job,
        relatedJobs,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiBriefcase className="text-indigo-600" />
          Job Listings
        </h2>
      </div>

      {/* Filters */}
      <div className="flex gap-6 mb-4 items-center">
        <div className="flex items-center gap-2">
          <FiFilter />
          <label className="text-sm">Filter By:</label>
        </div>

        <select
          onChange={(e) => setSelectedCompany(e.target.value)}
          value={selectedCompany}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Companies</option>
          {allCompanies.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilter(f => ({ ...f, range: e.target.value }))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Time</option>
          <option value="5min">Last 5 Minutes</option>
          <option value="1w">Last 1 Week</option>
          <option value="1m">Last 1 Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
        </select>

        <select
          onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-md border">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
            <tr>
              <th className="text-left py-3 px-5 border-b">Title</th>
              <th className="text-left py-3 px-5 border-b">Company</th>
              <th className="text-left py-3 px-5 border-b">Application</th>
              <th className="text-left py-3 px-5 border-b">Created & Expired</th>
              <th className="text-left py-3 px-5 border-b">Status</th>
              <th className="text-left py-3 px-5 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-5 font-medium text-indigo-700">{job.title}</td>
                <td className="py-3 px-5 font-medium text-indigo-700">{job.company}</td>
                <td className="py-3 px-5">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      job.isActive
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-5">
                  {new Date(job.postedAt).toLocaleDateString()} →{' '}
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </td>
                <td className="py-3 px-5 text-lg flex justify-start items-center">
                  {job.isActive ? (
                    <FiCheck className="text-green-600" size={20} />
                  ) : (
                    <FiX className="text-red-600" size={20} />
                  )}
                </td>
                <td className="py-3 px-5">
                  <button
                    onClick={() => handleViewJob(job)}
                    title="View"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobList;
