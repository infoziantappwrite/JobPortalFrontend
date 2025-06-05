import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiCheckSquare, FiSquare } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import EditJobModal from './EditJobModal';
import ViewJobModal from './ViewJobModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { motion, AnimatePresence } from 'framer-motion';

const JobList = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const role = user?.role?.toLowerCase();
  const token = localStorage.getItem('token');

  const [editForm, setEditForm] = useState({
    title: '', description: '', company: '', location: '', jobType: '', isActive: true,
    emailAddress: '', username: '', specialisms: [], offeredSalary: '', careerLevel: '',
    experience: '', gender: '', industry: '', qualification: '', applicationDeadline: '',
    country: '', city: '', address: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/jobs/all', {
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

  const openPopup = (job, view = false) => {
    setSelectedJob(job);
    setIsViewMode(view);
    setEditForm({
      ...job,
      specialisms: job.specialisms || [],
      applicationDeadline: job.applicationDeadline?.split('T')[0] || ''
    });
  };

  const closePopup = () => {
    setSelectedJob(null);
    setIsViewMode(false);
  };

  const handleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    if (role === 'candidate') return;
    const { name, value, type, checked } = e.target;
    if (name === 'specialisms') {
      setEditForm(prev => ({ ...prev, specialisms: value.split(',').map(s => s.trim()) }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/jobs/${selectedJob._id}`, editForm, { withCredentials: true });
      alert('Job updated successfully');
      closePopup();
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update job');
    }
  };

  const handleDelete = async () => {
    try {
      for (let id of selectedIds.length ? selectedIds : [selectedJob._id]) {
        await apiClient.delete(`/jobs/${id}`, { withCredentials: true });
      }
      alert('Deleted successfully');
      setConfirmDelete(false);
      closePopup();
      setSelectedIds([]);
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Job Listings</h2>
        {selectedIds.length > 0 && (
          <button onClick={() => setConfirmDelete(true)} className="text-red-600 font-semibold hover:text-red-800">
            <FiTrash2 className="inline mr-1" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="min-w-full">
          <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
            <tr>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Company</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {jobs.map(job => (
              <tr key={job._id} className="border-t hover:bg-gray-50">
                <td className="px-4">
                  <button onClick={() => handleCheckbox(job._id)}>
                    {selectedIds.includes(job._id) ? <FiCheckSquare /> : <FiSquare />}
                  </button>
                </td>
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.company}</td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4">{job.jobType}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-700'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-3">
                  <button onClick={() => openPopup(job, true)} title="View" className="text-indigo-600 hover:text-indigo-800">
                    <FiEye />
                  </button>
                  {role !== 'candidate' && (
                    <>
                      <button onClick={() => openPopup(job)} title="Edit" className="text-yellow-500 hover:text-yellow-700">
                        <FiEdit />
                      </button>
                      <button onClick={() => { setSelectedJob(job); setConfirmDelete(true); }} title="Delete" className="text-red-500 hover:text-red-700">
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

      {selectedJob && !isViewMode && !confirmDelete && (
        <EditJobModal
          formData={editForm}
          onChange={handleChange}
          onSubmit={handleUpdate}
          onClose={closePopup}
        />
      )}

      {selectedJob && isViewMode && (
        <ViewJobModal job={selectedJob} onClose={closePopup} />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          count={selectedIds.length || 1}
        />
      )}
    </div>
  );
};

export default JobList;
