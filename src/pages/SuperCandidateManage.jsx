import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination'; // ✅ Your shared pagination component

const SuperCandidateManage = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await apiClient.get('/superadmin/candidate');
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      toast.error('Failed to load candidates');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await apiClient.delete(`/superadmin/candidate/${id}`);
      toast.success('Candidate deleted');
      fetchCandidates();
    } catch (err) {
      toast.error('Failed to delete candidate');
    }
  };

  // Filter candidates by date
  const filteredCandidates = candidates.filter((c) => {
    const createdAt = new Date(c.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && createdAt < start) return false;
    if (end && createdAt > end) return false;
    return true;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset page on date filter change
  }, [startDate, endDate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Candidates</h1>

      {/* ✅ Filters */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-md w-full p-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-md w-full p-2"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredCandidates.length === 0 ? (
        <p className="text-center text-gray-500">No candidates found.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow border rounded-xl">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-left">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((c, idx) => (
                  <tr key={c._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => navigate(`/superadmin/candidate/${c._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default SuperCandidateManage;
