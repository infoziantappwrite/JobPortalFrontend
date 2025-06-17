import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ApproveEmployee = () => {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  const fetchPendingEmployees = async () => {
    try {
      const response = await apiClient.get('/company/employee/get/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pending = response.data.employees.filter(emp => emp.status !== 'approved' && emp.status !== 'rejected');
      setPendingEmployees(pending);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch employees');
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.patch(`/company/employee/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee approved');
      fetchPendingEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.patch(`/company/employee/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee rejected');
      fetchPendingEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📝 Approve or Reject New Employees</h2>

      {pendingEmployees.length === 0 ? (
        <p className="text-gray-500">No pending employees.</p>
      ) : (
        <div className="space-y-4">
          {pendingEmployees.map(emp => (
            <div key={emp._id} className="bg-white shadow rounded-lg p-5 flex justify-between items-center border border-gray-200">
              <div>
                <h3 className="text-xl font-semibold">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.email}</p>
                <p className="text-sm text-gray-600 italic">{emp.position || 'No position'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(emp._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FiCheckCircle /> Approve
                </button>
                <button
                  onClick={() => handleReject(emp._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveEmployee;
