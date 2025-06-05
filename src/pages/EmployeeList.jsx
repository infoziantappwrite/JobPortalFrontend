import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', password: '', position: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/company/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    }
  };

  const handleEditClick = (emp) => {
    setEditId(emp._id);
    setEditForm({
      name: emp.name,
      position: emp.position || '',
      password: '',
    });
  };

  const handleEditSubmit = async () => {
    try {
      await apiClient.put(`/update/employee/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee updated');
      setEditId(null);
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
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Employees</h2>
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div key={emp._id} className="border p-4 rounded shadow-sm">
              {editId === emp._id ? (
                <>
                  <div className="flex flex-col gap-2 mb-2">
                    <label className="text-sm font-semibold">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-2">
                    <label className="text-sm font-semibold">Position</label>
                    <input
                      type="text"
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="border p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm font-semibold">New Password</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="border p-2 rounded"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleEditSubmit}>
                      Save
                    </button>
                    <button className="bg-gray-500 text-white px-4 py-1 rounded" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {emp.name}</p>
                  <p><strong>Email:</strong> {emp.email}</p>
                  <p><strong>Position:</strong> {emp.position || 'Not specified'}</p>
                  <div className="flex gap-3 mt-3">
                    <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => handleEditClick(emp)}>
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleDelete(emp._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
