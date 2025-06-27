import { useEffect, useState } from 'react';
import {
  FiEye,
  FiBriefcase,
  FiFilter,
  FiCheck,
  FiX,
  FiSearch,
  FiBell
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
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [filter, jobs, selectedCompany, searchTerm]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await apiClient.get('/common/job/all', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const jobs = res.data.jobs || [];
      setJobs(jobs);

      const companiesMap = {};
      jobs.forEach(job => {
        if (job.companyID && job.company) {
          companiesMap[job.companyID] = job.company;
        }
      });

      const companyList = Object.entries(companiesMap).map(([id, name]) => ({ id, name }));
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

    if (selectedCompany !== 'all') {
      filtered = filtered.filter(job => job.companyID === selectedCompany);
    }

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

    if (filter.status !== 'all') {
      filtered = filtered.filter(job =>
        filter.status === 'active' ? job.isActive : !job.isActive
      );
    }

    // Filter by search term (job title or company)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
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
        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300
        peer-checked:bg-blue-600 transition-colors duration-300"
      />
      {/* Knob */}
      <div
        className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow
        transform transition-transform duration-300
        peer-checked:translate-x-5"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <FiBell className="text-indigo-600" />
            Job Alerts
          </h2>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-2 max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title or company"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-6 mb-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <FiFilter />
            <label className="text-sm font-medium text-gray-600">Filter By:</label>
          </div>

          <select
            onChange={(e) => setSelectedCompany(e.target.value)}
            value={selectedCompany}
            className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm"
          >
            <option value="all">All Companies</option>
            {allCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            onChange={(e) => setFilter(f => ({ ...f, range: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm"
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
            className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-md shadow-xl border">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-blue-100 text-blue-800 text-sm font-semibold">
              <tr>
                <th className="text-left py-3 px-5 border-b">Title</th>
                <th className="text-left py-3 px-5 border-b">Company</th>
                <th className="text-left py-3 px-5 border-b">Status</th>
                <th className="text-left py-3 px-5 border-b">Change Status</th>
                <th className="text-left py-3 px-5 border-b">Created → Expired</th>
                <th className="text-left py-3 px-5 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-5 font-medium text-indigo-700">{job.title}</td>
                  <td className="py-3 px-5 font-medium text-indigo-700">{job.company}</td>
                  <td className="py-3 px-5">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-700'
                      }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${job.isActive ? 'text-blue-700' : 'text-red-500'
                          }`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <ToggleSwitch
                        checked={job.isActive}
                        onChange={() => toggleJobStatus(job._id, !job.isActive)}
                      />
                    </div>
                  </td>


                  <td className="py-3 px-5">
                    {new Date(job.postedAt).toLocaleDateString()} →{' '}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleViewJob(job)}
                      title="View"
                      className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                    >
                      <FiEye className="text-blue-600 w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No jobs found for your alert.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
