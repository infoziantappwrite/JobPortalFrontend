import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import Pagination from './hooks/Pagination';
import { FiSearch, FiEye, FiTrash2, FiUserCheck } from 'react-icons/fi';
import { X } from 'lucide-react';

const SuperEmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

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

    // Inside useEffect
    if (searchTerm) {
      filtered = filtered.filter((emp) =>
        emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
    setCurrentPage(1);
  }, [searchTerm, statusFilter, companyFilter, startDate, endDate, employees]);

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

  const handleView = async (id) => {
    setViewLoading(true);
    try {
      const res = await apiClient.get(`/superadmin/employee/${id}`);
      setSelectedEmployee(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch employee details.');
    } finally {
      setViewLoading(false);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold mt-10 text-indigo-700">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Employee Management</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-xs mb-4 sm:mb-0">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 border-gray-300 rounded-md w-full p-2">
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Company Name</label>
              <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="mt-1 border-gray-300 rounded-md w-full p-2">
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
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 border-gray-300 rounded-md w-full p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 border-gray-300 rounded-md w-full p-2" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full bg-white text-gray-800">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="py-3 px-4 font-semibold text-left">Name</th>
                <th className="py-3 px-4 font-semibold text-left">Email</th>
                <th className="py-3 px-4 font-semibold text-left">Position</th>
                <th className="py-3 px-4 font-semibold text-left">Company</th>
                <th className="py-3 px-4 font-semibold text-left">Status</th>
                <th className="py-3 px-4 font-semibold text-left">Created At</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((emp, i) => (
                  <tr key={emp._id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                    <td className="py-3 px-4">{emp.name}</td>
                    <td className="py-3 px-4">{emp.email}</td>
                    <td className="py-3 px-4">{emp.position}</td>
                    <td className="py-3 px-4">{emp.companyId?.name || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[emp.status] || 'bg-gray-200 text-gray-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(emp.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-indigo-600 hover:text-indigo-800 font-medium mr-4 inline-flex items-center gap-1"
                        onClick={() => handleView(emp._id)}
                        disabled={viewLoading}
                      >
                        <FiEye size={16} /> View
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1"
                        onClick={() => handleDelete(emp._id)}
                      >
                        <FiTrash2 size={16} /> Delete
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-xl">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
              <h2 className="text-xl font-bold text-indigo-700 mb-4">{selectedEmployee.name}</h2>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Position:</strong> {selectedEmployee.position}</p>
              <p><strong>Status:</strong> {selectedEmployee.status}</p>
              <p><strong>Company:</strong> {selectedEmployee.companyId?.name || '—'}</p>
              <p><strong>Created At:</strong> {new Date(selectedEmployee.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperEmployeeManage;
