import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Users, SearchX } from 'lucide-react';

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

      const pending = response.data.employees.filter(
        (emp) => emp.status !== 'approved' && emp.status !== 'rejected'
      );
      setPendingEmployees(pending);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch employees');
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.patch(
        `/company/employee/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Employee approved');
      fetchPendingEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.patch(
        `/company/employee/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Employee rejected');
      fetchPendingEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-5xl mx-auto py-10">
        <div className="mb-8 flex items-center gap-3">
          <Users className="text-indigo-600" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
            Pending Employee Approvals
          </h2>
        </div>

        {pendingEmployees.length === 0 ? (
          <div className="min-h-96 flex flex-col justify-center items-center text-center text-gray-600 bg-gradient-to-br from-teal-50 to-blue-50 px-6 py-12 rounded-xl shadow-inner">
            <SearchX className="w-12 h-12 mb-4 text-teal-500" />
            <h2 className="text-xl font-semibold mb-2">No Pending Employees</h2>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pendingEmployees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center border border-gray-100 hover:shadow-xl transition"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{emp.name}</h3>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                  <p className="text-sm text-gray-600 italic">
                    {emp.position || 'No position specified'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(emp._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
                  >
                    <FiCheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(emp._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
                  >
                    <FiXCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveEmployee;
