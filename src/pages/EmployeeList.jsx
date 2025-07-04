import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import {
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  UserCheck,
  Search,
  Users,
  SearchX,
} from 'lucide-react';
import CreateEmployeeModal from './CreateEmployeeModal';
import IntenalLoader from '../components/InternalLoader';

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', password: '', position: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // ✅ local loading state
  

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/company/employee/get/');
      setEmployees(response.data.employees);
      setFilteredEmployees(response.data.employees);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (emp) => {
    setEditId(emp._id);
    setEditForm({ name: emp.name, position: emp.position || '', password: '' });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await apiClient.patch(`/company/employee/patch/${editId}`, editForm);
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
      await apiClient.delete(`/company/employee/delete/${id}`);
      toast.success('Employee deleted');
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  // ✅ Show loader while fetching
  if (loading) return <IntenalLoader />;

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          {/* Title */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="text-indigo-600" />
              Employee Directory
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or position..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
          >
            + Create Employee
          </button>
        </div>

        {/* Table Header */}
        {filteredEmployees.length > 0 && (
          <div className="hidden sm:grid grid-cols-12 font-semibold text-sm text-blue-700 bg-blue-100 px-6 py-3 rounded-t-lg">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-3">Position</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        )}

        {/* Table Rows */}
        <div className="bg-white divide-y rounded-b-xl shadow-md">
          {filteredEmployees.length === 0 ? (
            <div className="min-h-96 flex flex-col justify-center items-center text-center text-gray-600 bg-gradient-to-br from-teal-50 to-blue-50 px-6 py-12 rounded-xl shadow-inner">
              <SearchX className="w-12 h-12 mb-4 text-teal-500" />
              <h2 className="text-xl font-semibold mb-2">No Employees Found</h2>
              <p className="text-sm text-gray-500">Try adjusting your search or check the spelling.</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div
                key={emp._id}
                className="grid grid-cols-1 sm:grid-cols-12 px-6 py-4 gap-2 items-start sm:items-center hover:bg-gray-50 transition"
              >
                <div className="sm:col-span-3 font-medium text-gray-900">
                  <p
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setViewModal(true);
                    }}
                    className="cursor-pointer text-blue-800 hover:underline"
                  >
                    {emp.name}
                  </p>
                </div>
                <div className="sm:col-span-3 text-sm text-gray-700">{emp.email}</div>
                <div className="sm:col-span-3 text-sm text-gray-700">
                  {emp.position || <span className="italic text-gray-400">No position</span>}
                </div>
                <div className="sm:col-span-2 flex justify-start sm:justify-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setViewModal(true);
                    }}
                    className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                    title="View Employee"
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleEditClick(emp)}
                    className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
                    title="Edit Employee"
                  >
                    <Edit className="w-5 h-5 text-yellow-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateEmployeeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchEmployees}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <UserCheck size={24} />
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition flex items-center gap-2"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-[92%] max-w-2xl p-6 sm:p-8 border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                {selectedEmployee.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold mt-4 text-center">{selectedEmployee.name}</h2>
              <p className="text-purple-600 text-sm">Employee</p>
              <p className="text-gray-500 text-sm">{selectedEmployee.email}</p>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
              <UserCheck size={18} /> Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-semibold mt-1">{selectedEmployee.name}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold mt-1">{selectedEmployee.email}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-sm font-semibold mt-1">{selectedEmployee.position || 'Not specified'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Joined On</p>
                <p className="text-sm font-semibold mt-1">
                  {selectedEmployee.createdAt
                    ? new Date(selectedEmployee.createdAt).toLocaleString()
                    : 'N/A'}
                </p>

              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setViewModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition flex items-center gap-2 shadow-sm"
              >
                <X size={18} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>


  );
}
