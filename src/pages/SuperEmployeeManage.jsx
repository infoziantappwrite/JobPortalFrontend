import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

const SuperEmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/superadmin/employee/');
        setEmployees(res.data.employees);
        setFilteredEmployees(res.data.employees);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = [...employees];

    if (statusFilter) {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    if (companyFilter) {
      filtered = filtered.filter((emp) => emp.companyId?._id === companyFilter);
    }

    if (startDate) {
      filtered = filtered.filter((emp) => new Date(emp.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((emp) => new Date(emp.createdAt) <= new Date(endDate));
    }

    setFilteredEmployees(filtered);
  }, [statusFilter, companyFilter, startDate, endDate, employees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiClient.delete(`/superadmin/employee/${id}`);
        toast.success('Employee deleted successfully.');
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete employee.');
      }
    }
  };

  const uniqueCompanies = [
    ...new Map(
      employees
        .filter(emp => emp.companyId && emp.companyId._id)
        .map((emp) => [emp.companyId._id, emp.companyId])
    ).values(),
  ];

  const statusColors = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold mt-10 text-indigo-700">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 md:p-10">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Employee Management</h1>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 border-gray-300 rounded-md w-full p-2"
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Company Name</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="mt-1 border-gray-300 rounded-md w-full p-2"
            >
              <option value="">All</option>
              {uniqueCompanies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm bg-white">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 text-left">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Position</th>
              <th className="py-3 px-4 font-semibold">Company Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Created At</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, i) => (
                <tr
                  key={emp._id}
                  className={`border-t ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}
                >
                  <td className="py-3 px-4">{emp.name}</td>
                  <td className="py-3 px-4">{emp.email}</td>
                  <td className="py-3 px-4">{emp.position}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{emp.companyId?.name || '—'}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[emp.status] || 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                      onClick={() => alert(`Viewing ${emp.name}`)}
                    >
                      View
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No matching employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperEmployeeManage;
