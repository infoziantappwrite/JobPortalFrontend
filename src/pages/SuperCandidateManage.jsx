import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const SuperCandidateManage = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Candidates</h1>

      {candidates.length === 0 ? (
        <p className="text-center text-gray-500">No candidates found.</p>
      ) : (
        <div className="overflow-x-auto shadow border rounded-xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-left">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr key={c._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4">{c.email}</td>
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
      )}
    </div>
  );
};

export default SuperCandidateManage;
