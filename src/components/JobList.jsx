import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiCheckSquare, FiSquare } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import EditJobModal from './EditJobModal';
import ViewJobModal from './ViewJobModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { FiBriefcase, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const JobList = ({ user }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filter, setFilter] = useState({ range: 'all', status: 'all' });

  const role = user?.role?.toLowerCase();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/common/job/all', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const now = new Date();
    let filtered = [...jobs];

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
        const diff = (now - createdAt) / (1000 * 60); // in minutes
        return diff <= minutes;
      });
    }

    if (filter.status !== 'all') {
      filtered = filtered.filter(job =>
        filter.status === 'active' ? job.isActive : !job.isActive
      );
    }

    setFilteredJobs(filtered);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJobs.map(j => j._id));
    }
  };

  const handleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      for (let id of selectedIds) {
        await apiClient.delete(`/jobs/${id}`, { withCredentials: true });
      }
      alert('Deleted successfully');
      setConfirmDelete(false);
      setSelectedIds([]);
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiBriefcase className="text-indigo-600" />
          Job Listings
        </h2>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-red-600 font-semibold hover:text-red-800"
          >
            <FiTrash2 className="inline mr-1" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-6 mb-4 items-center">
        <div className="flex items-center gap-2">
          <FiFilter />
          <label className="text-sm">Filter By:</label>
        </div>
        <select onChange={(e) => setFilter(f => ({ ...f, range: e.target.value }))} className="border rounded px-2 py-1 text-sm">
          <option value="all">All Time</option>
          <option value="5min">Last 5 Minutes</option>
          <option value="1w">Last 1 Week</option>
          <option value="1m">Last 1 Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
        </select>
        <select onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))} className="border rounded px-2 py-1 text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="min-w-full">
          <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
            <tr>
              <th className="py-2 px-4">
                <button onClick={handleSelectAll}>
                  {selectedIds.length === filteredJobs.length ? <FiCheckSquare /> : <FiSquare />}
                </button>
              </th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Application</th>
              <th className="py-2 px-4">Created & Expired</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredJobs.map(job => (
              <tr key={job._id} className="border-t hover:bg-gray-50">
                <td className="px-4">
                  <button onClick={() => handleCheckbox(job._id)}>
                    {selectedIds.includes(job._id) ? <FiCheckSquare /> : <FiSquare />}
                  </button>
                </td>
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-700'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">{new Date(job.postedAt).toLocaleDateString()} & {new Date(job.applicationDeadline).toLocaleDateString()}</td>
                <td className="py-3 px-4">{job.isActive ? '✔️' : '❌'}</td>
                <td className="py-3 px-4 flex gap-3">
                  <button onClick={() => navigate('/jobs/view', { state: job })} title="View" className="text-indigo-600 hover:text-indigo-800">
                    <FiEye />
                  </button>
                  {role !== 'candidate' && (
                    <>
                      <button onClick={() => navigate('/jobs/edit', { state: job })} title="Edit" className="text-yellow-600 hover:text-yellow-800">
                        <FiEdit />
                      </button>
                      <button onClick={() => { setSelectedIds([job._id]); setConfirmDelete(true); }} title="Delete" className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          count={selectedIds.length}
        />
      )}
    </div>
  );
};


export default JobList;
