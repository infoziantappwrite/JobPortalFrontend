import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Pagination from './hooks/Pagination';

const SuperCandidateManage = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

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

  const filteredCandidates = candidates.filter((c) => {
    const createdAt = new Date(c.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && createdAt < start) return false;
    if (end && createdAt > end) return false;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">Candidate Management</h1>

        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 border-gray-300 rounded-md w-full p-2"
              />
            </div>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No matching candidates found.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow-xl border border-blue-200">
              <table className="min-w-full bg-white text-gray-800">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-left">Name</th>
                    <th className="py-3 px-4 font-semibold text-left">Email</th>
                    <th className="py-3 px-4 font-semibold text-left">Created At</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCandidates.map((c, idx) => (
                    <tr
                      key={c._id}
                      className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                    >
                      <td className="py-3 px-4">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/superadmin/candidate/${c._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SuperCandidateManage;
