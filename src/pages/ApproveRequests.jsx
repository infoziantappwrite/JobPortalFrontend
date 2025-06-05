// src/pages/ApproveRequests.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

const ApproveRequests = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);

  useEffect(() => {
    const fetchPendingCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiClient.get('/pending/companies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCompanies(res.data.pendingCompanies);
      } catch (err) {
        console.error('Error fetching pending companies:', err);
        toast.error('Failed to fetch pending companies.');
      }
    };

    fetchPendingCompanies();
  }, []);

  const handleApprove = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.post(`/approve/company/${companyId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Company approved!');
      setPendingCompanies(prev => prev.filter(c => c._id !== companyId));
    } catch (err) {
      console.error('Error approving company:', err);
      toast.error('Failed to approve company.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pending Company Approvals</h2>
      {pendingCompanies.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="border px-4 py-2">Company Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCompanies.map((company) => (
              <tr key={company._id}>
                <td className="border px-4 py-2">{company.name}</td>
                <td className="border px-4 py-2">{company.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleApprove(company._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveRequests;
