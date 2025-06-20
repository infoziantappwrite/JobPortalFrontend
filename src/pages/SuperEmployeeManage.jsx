import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

const SuperEmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/uperadmin/employee/');
        console.log('Fetched Employees:', res.data.employees); // Debugging line
        
        setEmployees(res.data.employees);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold mt-10 text-indigo-700">Loading employees...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center text-lg font-semibold mt-10 text-red-600">No employees found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-10">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">Employee Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div
            key={emp._id}
            className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-indigo-600 text-3xl">
                <FiUser />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{emp.name}</h2>
                <p className="text-sm text-gray-500">{emp.position}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <FiMail className="text-indigo-500" /> {emp.email}
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-indigo-500" /> {emp.phone || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <FiBriefcase className="text-indigo-500" /> {emp.department || 'Not Assigned'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperEmployeeManage;
