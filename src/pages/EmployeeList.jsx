import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', password: '', position: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/company/employee/get/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    }
  };

  const handleEditClick = (emp) => {
    setEditId(emp._id);
    setEditForm({ name: emp.name, position: emp.position || '', password: '' });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await apiClient.patch(`/company/employee/get/employee/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee updated');
      setEditId(null);
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await apiClient.delete(`/delete/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee deleted');
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 Employee Directory</h2>

      <div className="space-y-4">
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white border border-gray-200 shadow-md rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {emp.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{emp.name}</p>
                  <p className="text-sm text-gray-600">{emp.position || <span className="italic text-gray-400">No position</span>}</p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => handleEditClick(emp)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => handleDelete(emp._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Edit Employee</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                💾 Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
              >
                ✖ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
