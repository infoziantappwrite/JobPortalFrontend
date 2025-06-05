import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

export default function ApprovedAdmins() {
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await apiClient.get('/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data.admins);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch admins');
    }
  };

  const handleEditClick = (admin) => {
    setEditId(admin._id);
    setEditForm({
      name: admin.name,
      email: admin.email,
      password: '', // leave password blank initially
    });
  };

  const handleEditSubmit = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      setLoading(true);
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      await axios.put(`/api/admins/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Admin updated');
      setEditId(null);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      await axios.delete(`/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Admin deleted');
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete admin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Approved Admins</h2>
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        {admins.length === 0 ? (
          <p>No approved admins found.</p>
        ) : (
          admins.map((admin) => (
            <div key={admin._id} className="border p-4 rounded shadow-sm">
              {editId === admin._id ? (
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
                    <label className="text-sm font-semibold">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                      onClick={handleEditSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-1 rounded"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {admin.name}</p>
                  <p><strong>Email:</strong> {admin.email}</p>
                  <p><strong>Joined:</strong> {new Date(admin.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-3 mt-3">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded"
                      onClick={() => handleEditClick(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() => handleDelete(admin._id)}
                    >
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
